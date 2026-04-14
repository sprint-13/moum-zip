export async function POST(req: Request) {
  const body = await req.json();

  const issue = body.data?.issue;
  const title = issue?.title ?? "Unknown Error";
  const url = issue?.web_url ?? "";
  const project = body.data?.project ?? "";
  const level = issue?.level ?? "error";

  const levelEmoji: Record<string, string> = {
    fatal: "💀",
    error: "🔴",
    warning: "🟡",
    info: "🔵",
  };

  const emoji = levelEmoji[level] ?? "🔴";

  await fetch(process.env.DISCORD_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: `${emoji} ${title}`,
          url,
          color: level === "fatal" ? 0x000000 : level === "warning" ? 0xffa500 : 0xff0000,
          fields: [
            { name: "Project", value: project, inline: true },
            { name: "Level", value: level, inline: true },
          ],
        },
      ],
    }),
  });

  return new Response("ok", { status: 200 });
}
