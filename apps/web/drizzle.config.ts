import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
  schema: "./src/shared/db/scheme.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // biome-ignore lint: 환경변수는 서버에서만 접근 가능하므로 안전하다.
    url: process.env.DATABASE_URL!,
  },
});
