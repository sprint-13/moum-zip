export type Requester = {
  userId: number;
  role: "manager" | "moderator" | "member";
};

/**
 * 작성자 또는 manager만 수정·삭제할 수 있다.
 * 권한이 없으면 에러를 던진다.
 */
export function assertPermission(authorId: number, requester: Requester): void {
  if (requester.userId !== authorId && requester.role !== "manager") {
    throw new Error("권한이 없습니다.");
  }
}

export function hasPermission(requester: Requester, authorId?: number): boolean {
  return requester.userId === authorId || requester.role === "manager";
}

/**
 * manager 또는 moderator만 멤버를 추방할 수 있다.
 */
export function assertCanKick(requester: Requester): void {
  if (requester.role === "member") {
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
