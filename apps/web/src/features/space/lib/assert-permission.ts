import { DomainError } from "@/shared/lib/error";
import { ERROR_CODES } from "@/shared/lib/errors/error-codes";

export type Requester = {
  userId: number;
  role: "manager" | "moderator" | "member";
};

/**
 * 작성자 또는 manager만 수정·삭제할 수 있다.
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
