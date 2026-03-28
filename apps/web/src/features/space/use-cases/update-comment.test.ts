import { beforeEach, describe, expect, it, vi } from "vitest";
import { updateCommentUseCase } from "./update-comment";

vi.mock("@/entities/post/queries", () => ({
  commentQueries: {
    findById: vi.fn(),
    updateById: vi.fn(),
  },
}));

import { commentQueries } from "@/entities/post/queries";

const mockFindById = vi.mocked(commentQueries.findById);
const mockUpdateById = vi.mocked(commentQueries.updateById);

const BASE_COMMENT = {
  id: "comment-1",
  postId: "post-1",
  spaceId: "space-1",
  authorId: 1,
  content: "기존 내용",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("updateCommentUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateById.mockResolvedValue({ ...BASE_COMMENT, content: "수정된 내용" });
  });

  it("작성자는 본인 댓글을 수정할 수 있다", async () => {
    mockFindById.mockResolvedValue(BASE_COMMENT);

    const result = await updateCommentUseCase("comment-1", "수정된 내용", { userId: 1, role: "member" });

    expect(mockUpdateById).toHaveBeenCalledWith("comment-1", "수정된 내용");
    expect(result).toEqual({ commentId: "comment-1" });
  });

  it("manager는 타인의 댓글을 수정할 수 있다", async () => {
    mockFindById.mockResolvedValue({ ...BASE_COMMENT, authorId: 99 });

    const result = await updateCommentUseCase("comment-1", "수정된 내용", { userId: 1, role: "manager" });

    expect(mockUpdateById).toHaveBeenCalled();
    expect(result).toEqual({ commentId: "comment-1" });
  });

  it("존재하지 않는 댓글 수정 시 에러를 던진다", async () => {
    mockFindById.mockResolvedValue(undefined as never);

    await expect(updateCommentUseCase("no-such", "수정 내용", { userId: 1, role: "member" })).rejects.toThrow(
      "댓글을 찾을 수 없습니다.",
    );
    expect(mockUpdateById).not.toHaveBeenCalled();
  });

  it("작성자가 아니고 manager도 아니면 에러를 던진다", async () => {
    mockFindById.mockResolvedValue({ ...BASE_COMMENT, authorId: 99 });

    await expect(updateCommentUseCase("comment-1", "수정 내용", { userId: 1, role: "member" })).rejects.toThrow(
      "권한이 없습니다.",
    );
    expect(mockUpdateById).not.toHaveBeenCalled();
  });

  it("빈 내용은 DB 호출 없이 에러를 던진다", async () => {
    await expect(updateCommentUseCase("comment-1", "   ", { userId: 1, role: "member" })).rejects.toThrow(
      "댓글 내용을 입력해주세요.",
    );
    expect(mockFindById).not.toHaveBeenCalled();
    expect(mockUpdateById).not.toHaveBeenCalled();
  });
});
