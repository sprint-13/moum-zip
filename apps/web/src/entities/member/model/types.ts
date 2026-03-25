import type { spaceMembers } from "@/shared/db/scheme";

/**
 * scheme.ts의 enum에서 파생 — 스키마 변경 시 자동으로 동기화됨.
 * enum: ["manager", "moderator", "member"]
 */
export type MemberRole = (typeof spaceMembers.role.enumValues)[number];

/**
 * 역할별 게시판/기능 단위 권한
 * - board: 게시판 생성·삭제
 * - post: 게시글 작성·수정·삭제
 * - schedule: 일정 생성·수정·삭제
 * - resource: 자료 업로드·삭제
 * - member: 멤버 초대·추방·역할 변경
 */
export interface RolePermissions {
  board: { create: boolean; delete: boolean };
  post: { create: boolean; edit: boolean; delete: boolean };
  schedule: { create: boolean; edit: boolean; delete: boolean };
  resource: { upload: boolean; delete: boolean };
  member: { invite: boolean; kick: boolean; changeRole: boolean };
}
export const ROLE_LABEL: Record<MemberRole, string> = {
  manager: "Manager",
  moderator: "Moderator",
  member: "Member",
};

export const ROLE_PERMISSIONS: Record<MemberRole, RolePermissions> = {
  manager: {
    board: { create: true, delete: true },
    post: { create: true, edit: true, delete: true },
    schedule: { create: true, edit: true, delete: true },
    resource: { upload: true, delete: true },
    member: { invite: true, kick: true, changeRole: true },
  },
  moderator: {
    board: { create: false, delete: false },
    post: { create: true, edit: true, delete: true },
    schedule: { create: true, edit: true, delete: false },
    resource: { upload: true, delete: false },
    member: { invite: true, kick: false, changeRole: false },
  },
  member: {
    board: { create: false, delete: false },
    post: { create: true, edit: false, delete: false },
    schedule: { create: false, edit: false, delete: false },
    resource: { upload: true, delete: false },
    member: { invite: false, kick: false, changeRole: false },
  },
};
