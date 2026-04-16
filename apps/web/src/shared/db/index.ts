import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as scheme from "./scheme";

// biome-ignore lint: 환경변수는 서버에서만 접근 가능하므로 안전하다.
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql, schema: scheme });
