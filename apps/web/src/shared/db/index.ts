import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as scheme from "./scheme";

// DB 인스턴스를 처음 사용할 때까지 초기화를 지연합니다.
// 모듈 import 시점에 neon()을 호출하면 환경변수가 아직 준비되지 않은
// 환경(테스트, 일부 번들러)에서 에러가 발생하기 때문입니다.
type DB = ReturnType<typeof drizzle<typeof scheme>>;
let _db: DB | undefined;

function getDb(): DB {
  if (!_db) {
    // biome-ignore lint: 환경변수는 서버에서만 접근 가능하므로 안전하다.
    const sql = neon(process.env.DATABASE_URL!);
    _db = drizzle({ client: sql, schema: scheme });
  }
  return _db;
}

// Proxy를 통해 db.query, db.insert 등 기존 호출부를 그대로 유지하면서
// 실제 접근이 일어날 때 getDb()로 초기화를 트리거합니다.
export const db = new Proxy({} as DB, {
  get(_, prop) {
    return getDb()[prop as keyof DB];
  },
});
