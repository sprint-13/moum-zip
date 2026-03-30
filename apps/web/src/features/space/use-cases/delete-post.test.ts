import { beforeEach, describe, expect, it, vi } from "vitest";
import { deletePostUseCase } from "./delete-post";

vi.mock("@/entities/post/queries", () => ({
  postQueries: {
    findById: vi.fn(),
    deleteById: vi.fn(),
  },
}));

import { postQueries } from "@/entities/post/queries";

const mockFindById = vi.mocked(postQueries.findById);
const mockDeleteById = vi.mocked(postQueries.deleteById);

const BASE_POST = {
  id: "post-1",
  spaceId: "space-1",
  authorId: 1,
  category: "notice" as const,
  title: "제목",
  content: "내용",
  image: null,
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};
const BASE_AUTHOR = { id: 1, name: "작성자", image: null };

describe("deletePostUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDeleteById.mockResolvedValue([BASE_POST]);
  });

  it("작성자는 본인 게시글을 삭제할 수 있다", async () => {
    mockFindById.mockResolvedValue([{ post: BASE_POST, author: BASE_AUTHOR }]);

    const result = await deletePostUseCase("post-1", { userId: 1, role: "member" });

    expect(mockDeleteById).toHaveBeenCalledWith("post-1");
    expect(result).toEqual({ postId: "post-1" });
  });

  it("manager는 타인의 게시글을 삭제할 수 있다", async () => {
    mockFindById.mockResolvedValue([{ post: { ...BASE_POST, authorId: 99 }, author: BASE_AUTHOR }]);

    const result = await deletePostUseCase("post-1", { userId: 1, role: "manager" });

    expect(mockDeleteById).toHaveBeenCalledWith("post-1");
    expect(result).toEqual({ postId: "post-1" });
  });

  it("존재하지 않는 게시글 삭제 시 에러를 던진다", async () => {
    mockFindById.mockResolvedValue([]);

    await expect(deletePostUseCase("no-such", { userId: 1, role: "member" })).rejects.toThrow(
      "게시글을 찾을 수 없습니다.",
    );
    expect(mockDeleteById).not.toHaveBeenCalled();
  });

  it("작성자가 아니고 manager도 아니면 에러를 던진다", async () => {
    mockFindById.mockResolvedValue([{ post: { ...BASE_POST, authorId: 99 }, author: BASE_AUTHOR }]);

    await expect(deletePostUseCase("post-1", { userId: 1, role: "member" })).rejects.toThrow("권한이 없습니다.");
    expect(mockDeleteById).not.toHaveBeenCalled();
  });
});
