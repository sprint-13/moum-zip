import { beforeEach, describe, expect, it, vi } from "vitest";
import { NotFoundError } from "@/shared/lib/error";
import { updatePostUseCase } from "./update-post";

vi.mock("@/entities/post/queries", () => ({
  postQueries: {
    findById: vi.fn(),
    updateById: vi.fn(),
  },
}));

import { postQueries } from "@/entities/post/queries";

const mockFindById = vi.mocked(postQueries.findById);
const mockUpdateById = vi.mocked(postQueries.updateById);

const BASE_POST = {
  id: "post-1",
  spaceId: "space-1",
  authorId: 1,
  category: "notice" as const,
  title: "기존 제목",
  content: "기존 내용",
  image: null,
  viewCount: 0,
  likeCount: 0,
  commentCount: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};
const BASE_AUTHOR = { id: 1, name: "작성자", image: null };

const BASE_INPUT = {
  postId: "post-1",
  spaceId: "space-1",
  title: "수정된 제목",
  content: "수정된 내용",
  category: "discussion" as const,
};

describe("updatePostUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUpdateById.mockResolvedValue([BASE_POST]);
  });

  it("작성자는 본인 게시글을 수정할 수 있다", async () => {
    mockFindById.mockResolvedValue([{ post: BASE_POST, author: BASE_AUTHOR }]);

    const result = await updatePostUseCase(BASE_INPUT, { userId: 1, role: "member" });

    expect(mockUpdateById).toHaveBeenCalledWith("post-1", {
      title: "수정된 제목",
      content: "수정된 내용",
      category: "discussion",
    });
    expect(result).toEqual({ postId: "post-1" });
  });

  it("manager는 타인의 게시글을 수정할 수 있다", async () => {
    mockFindById.mockResolvedValue([{ post: { ...BASE_POST, authorId: 99 }, author: BASE_AUTHOR }]);

    const result = await updatePostUseCase(BASE_INPUT, { userId: 1, role: "manager" });

    expect(mockUpdateById).toHaveBeenCalled();
    expect(result).toEqual({ postId: "post-1" });
  });

  it("존재하지 않는 게시글 수정 시 AppError(POST_NOT_FOUND)를 던진다", async () => {
    mockFindById.mockResolvedValue([]);

    await expect(updatePostUseCase(BASE_INPUT, { userId: 1, role: "member" })).rejects.toThrow(
      new NotFoundError("POST_NOT_FOUND"),
    );
    expect(mockUpdateById).not.toHaveBeenCalled();
  });

  it("다른 스페이스의 게시글 수정 시 AppError(POST_NOT_FOUND)를 던진다", async () => {
    mockFindById.mockResolvedValue([{ post: { ...BASE_POST, spaceId: "other-space" }, author: BASE_AUTHOR }]);

    await expect(updatePostUseCase(BASE_INPUT, { userId: 1, role: "manager" })).rejects.toThrow(
      new NotFoundError("POST_NOT_FOUND"),
    );
    expect(mockUpdateById).not.toHaveBeenCalled();
  });

  it("작성자가 아니고 manager도 아니면 에러를 던진다", async () => {
    mockFindById.mockResolvedValue([{ post: { ...BASE_POST, authorId: 99 }, author: BASE_AUTHOR }]);

    await expect(updatePostUseCase(BASE_INPUT, { userId: 1, role: "member" })).rejects.toThrow("권한이 없습니다.");
    expect(mockUpdateById).not.toHaveBeenCalled();
  });

  it("빈 제목은 DB 호출 없이 에러를 던진다", async () => {
    await expect(updatePostUseCase({ ...BASE_INPUT, title: "   " }, { userId: 1, role: "member" })).rejects.toThrow(
      "제목을 입력해주세요.",
    );
    expect(mockFindById).not.toHaveBeenCalled();
    expect(mockUpdateById).not.toHaveBeenCalled();
  });

  it("빈 본문은 DB 호출 없이 에러를 던진다", async () => {
    await expect(updatePostUseCase({ ...BASE_INPUT, content: "   " }, { userId: 1, role: "member" })).rejects.toThrow(
      "본문을 입력해주세요.",
    );
    expect(mockFindById).not.toHaveBeenCalled();
    expect(mockUpdateById).not.toHaveBeenCalled();
  });
});
