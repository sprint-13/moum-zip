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

export function hasPermission(authorId: number, requester: Requester): boolean {
  return requester.userId === authorId || requester.role === "manager";
}
