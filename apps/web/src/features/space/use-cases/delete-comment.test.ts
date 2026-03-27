import { beforeEach, describe, expect, it, vi } from "vitest";
import { deleteCommentUseCase } from "./delete-comment";

vi.mock("@/entities/post/queries", () => ({
  commentQueries: {
    findById: vi.fn(),
    deleteById: vi.fn(),
  },
}));

import { commentQueries } from "@/entities/post/queries";

const mockFindById = vi.mocked(commentQueries.findById);
const mockDeleteById = vi.mocked(commentQueries.deleteById);

const BASE_COMMENT = {
  id: "comment-1",
  postId: "post-1",
  spaceId: "space-1",
  authorId: 1,
  content: "내용",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("deleteCommentUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteById.mockResolvedValue(BASE_COMMENT);
  });

  it("작성자는 본인 댓글을 삭제할 수 있다", async () => {
    mockFindById.mockResolvedValue(BASE_COMMENT);

    const result = await deleteCommentUseCase("comment-1", "post-1", { userId: 1, role: "member" });

    expect(mockDeleteById).toHaveBeenCalledWith("comment-1", "post-1");
    expect(result).toEqual({ commentId: "comment-1" });
  });

  it("manager는 타인의 댓글을 삭제할 수 있다", async () => {
    mockFindById.mockResolvedValue({ ...BASE_COMMENT, authorId: 99 });

    const result = await deleteCommentUseCase("comment-1", "post-1", { userId: 1, role: "manager" });

    expect(mockDeleteById).toHaveBeenCalledWith("comment-1", "post-1");
    expect(result).toEqual({ commentId: "comment-1" });
  });

  it("존재하지 않는 댓글 삭제 시 에러를 던진다", async () => {
    mockFindById.mockResolvedValue(undefined as never);

    await expect(deleteCommentUseCase("no-such", "post-1", { userId: 1, role: "member" })).rejects.toThrow(
      "댓글을 찾을 수 없습니다.",
    );
    expect(mockDeleteById).not.toHaveBeenCalled();
  });

  it("작성자가 아니고 manager도 아니면 에러를 던진다", async () => {
    mockFindById.mockResolvedValue({ ...BASE_COMMENT, authorId: 99 });

    await expect(deleteCommentUseCase("comment-1", "post-1", { userId: 1, role: "member" })).rejects.toThrow(
      "권한이 없습니다.",
    );
    expect(mockDeleteById).not.toHaveBeenCalled();
  });
});
