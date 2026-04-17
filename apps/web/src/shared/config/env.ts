export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "https://together-dallaem-api.vercel.app").replace(
  /\/+$/,
  "",
);

export const TEAM_ID = process.env.NEXT_PUBLIC_TEAM_ID ?? "moum-zip-dev";
