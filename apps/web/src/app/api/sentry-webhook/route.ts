import crypto from "node:crypto";

interface SentryWebhookBody {
  action?: "created" | "triggered" | "resolved" | "ignored" | "assigned";
  data?: {
    issue?: {
      title?: string;
      web_url?: string;
      level?: string;
    };
    event?: {
      title?: string;
      message?: string;
      culprit?: string;
      level?: string;
    };
    project?: string;
  };
}

/**
 * 요청이 실제 Sentry에서 왔는지 서명으로 검증
 *
 * Sentry는 웹훅 요청 시 secret으로 payload를 암호화한 값을 헤더에 담아 보냄
 * 같은 방식으로 암호화해서 비교하면 요청 출처를 신뢰할 수 있음
 */
function verifySentrySignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;

  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  if (signature.length !== expected.length) return false;

  // 타이밍 공격 방지를 위해 timingSafeEqual로 상수 시간 비교
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function POST(req: Request) {
  const secret = process.env.SENTRY_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("Server configuration error", { status: 500 });
  }

  const discordUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!discordUrl) {
    return new Response("Webhook URL not configured", { status: 500 });
  }

  // req.json() 대신 req.text() 사용
  // 서명 검증은 Sentry가 보낸 원본 바이트 그대로 해야 하는데
  // req.json()으로 파싱하면 원본 텍스트를 복원할 수 없음
  const rawBody = await req.text();
  const signature = req.headers.get("sentry-hook-signature");

  if (!verifySentrySignature(rawBody, signature, secret)) {
    return new Response("Invalid signature", { status: 401 });
  }

  let body: SentryWebhookBody;
  try {
    body = JSON.parse(rawBody) as SentryWebhookBody;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  // 이슈가 생성되었거나 에러가 새로 발생했을 때만 알림 전송
  // resolved, ignored, assigned 등의 액션은 무시 — 해결 처리해도 에러 알림이 오는 문제 방지
  const action = body.action;
  if (action && !["created", "triggered"].includes(action)) {
    return new Response("Ignored action", { status: 200 });
  }

  const { data } = body;
  const issue = data?.issue;
  const event = data?.event;

  // Discord embed title 최대치가 256자이므로 250자로 제한
  const title = (event?.title ?? issue?.title ?? "Unknown Error").slice(0, 250);

  const url = issue?.web_url || undefined;
  const project = data?.project ?? "";

  // issue에 없으면 event에서 level 참조
  const level = issue?.level ?? event?.level ?? "error";

  const levelEmoji: Record<string, string> = {
    fatal: "💀",
    error: "🔴",
    warning: "🟡",
    info: "🔵",
  };

  // 삼항 연산자로 처리하면 info 레벨을 빠뜨리기 쉬워서 Record로 관리
  const levelColor: Record<string, number> = {
    fatal: 0x000000,
    error: 0xff0000,
    warning: 0xffa500,
    info: 0x0000ff,
  };

  const emoji = levelEmoji[level] ?? "🔴";
  const color = levelColor[level] ?? 0xff0000;
  const MAX_LENGTH = 400;

  const culpritField = event?.culprit
    ? [{ name: "📍 발생 위치", value: `\`${event.culprit.slice(0, MAX_LENGTH)}\``, inline: false }]
    : [];

  // 에러 본문 메시지 파싱 - 길이 제한 후 코드 블록으로 표시
  const rawMessage = event?.message ?? "";
  const truncatedMessage =
    rawMessage.length > MAX_LENGTH ? rawMessage.slice(0, MAX_LENGTH) + "\n… (truncated)" : rawMessage;
  const messageField = truncatedMessage
    ? [{ name: "💬 에러 메시지", value: `\`\`\`\n${truncatedMessage}\n\`\`\``, inline: false }]
    : [];

  try {
    const response = await fetch(discordUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            // url 지정 - 제목 자체가 Sentry 링크로 연결
            title: `${emoji} ${title}`,
            url,
            color,
            fields: [
              ...culpritField,
              { name: "🗂 프로젝트", value: project || "N/A", inline: true },
              { name: "🚨 심각도", value: level, inline: true },
              ...messageField,
            ],
            footer: { text: `Sentry • ${project || "N/A"}` },
            // 에러 발생 시각을 Discord 메시지에 기록
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });

    // fetch 성공 != Discord 정상 처리
    // response.ok를 확인하지 않으면 Discord 측 오류를 Sentry에 알릴 수 없음
    if (!response.ok) {
      // Discord가 왜 거부했는지 본문을 로깅 — 400이나 429 원인 파악용
      const errorText = await response.text();
      console.error("Discord webhook failed:", response.status, errorText);
      return new Response("Failed to send Discord notification", { status: 502 });
    }
  } catch {
    return new Response("Internal server error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
