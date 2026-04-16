import { DomainError } from "@/shared/lib/error";
import { ERROR_CODES } from "@/shared/lib/errors/error-codes";

export type Requester = {
  userId: number;
  role: "manager" | "moderator" | "member";
};

/**
 * 작성자 또는 manager만 수정, 삭제할 수 있다.
 * 권한이 없으면 에러를 던진다.
 */
export const assertPermission = (authorId: number, requester: Requester): void => {
  if (requester.userId !== authorId && requester.role !== "manager") {
    throw new DomainError(ERROR_CODES.FORBIDDEN, {
      message: "권한이 없습니다.",
    });
  }
};

export const hasPermission = (requester: Requester, authorId?: number): boolean => {
  return requester.userId === authorId || requester.role === "manager";
};

/**
 * manager 또는 moderator만 멤버를 추방할 수 있다. 자기 자신은 추방 불가.
 */
export function assertCanKick(
  requester: Requester,
  targetUserId: number,
  targetRole: "manager" | "moderator" | "member",
): void {
  if (requester.role === "member") {
    throw new Error("권한이 없습니다.");
  }
  if (requester.userId === targetUserId) {
    throw new Error("자기 자신을 추방할 수 없습니다.");
  }
  // moderator는 manager/moderator 추방 불가
  if (requester.role === "moderator" && targetRole !== "member") {
    throw new Error("권한이 없습니다.");
  }
}

/**
 * manager만 역할을 변경할 수 있다.
 */
export function assertCanChangeRole(requester: Requester): void {
  if (requester.role !== "manager") {
    throw new Error("권한이 없습니다.");
  }
}
