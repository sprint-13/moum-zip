import crypto from "node:crypto";

interface SentryWebhookBody {
  data?: {
    issue?: {
      title?: string;
      web_url?: string;
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

  try {
    // 타이밍 공격 방지를 위해 timingSafeEqual로 상수 시간 비교
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
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

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const { data } = body as SentryWebhookBody;
  const issue = data?.issue;
  const title = issue?.title ?? "Unknown Error";
  const url = issue?.web_url ?? "";
  const project = data?.project ?? "";
  const level = issue?.level ?? "error";

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

  try {
    const response = await fetch(discordUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        embeds: [
          {
            title: `${emoji} ${title}`,
            url,
            color,
            fields: [
              { name: "Project", value: project, inline: true },
              { name: "Level", value: level, inline: true },
            ],
          },
        ],
      }),
    });

    // fetch 성공 != Discord 정상 처리
    // response.ok를 확인하지 않으면 Discord 측 오류를 Sentry에 알릴 수 없음
    if (!response.ok) {
      return new Response("Failed to send Discord notification", { status: 502 });
    }
  } catch {
    return new Response("Internal server error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}
