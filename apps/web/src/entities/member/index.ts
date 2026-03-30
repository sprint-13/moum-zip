// DB 형태 타입 — scheme.ts가 source of truth
export type { Member, NewMember } from "@/shared/db/scheme";

// 비즈니스 도메인 타입 — DB 스키마와 무관한 순수 도메인 개념
export type { MemberRole, RolePermissions } from "./model/types";
export { ROLE_LABEL, ROLE_PERMISSIONS } from "./model/types";

export { memberQueries } from "./queries";
