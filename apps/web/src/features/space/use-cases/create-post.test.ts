import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPostUseCase } from "./create-post";

vi.mock("@/entities/post/queries", () => ({
  postQueries: {
    create: vi.fn(),
  },
}));

import { postQueries } from "@/entities/post/queries";

const mockCreate = vi.mocked(postQueries.create);

describe("createPostUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue([]);
  });

  it("postQueries.create를 올바른 인자로 호출한다", async () => {
    await createPostUseCase({
      spaceId: "space-1",
      authorId: 42,
      category: "notice",
      title: "공지사항",
      content: "내용입니다.",
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        spaceId: "space-1",
        authorId: 42,
        category: "notice",
        title: "공지사항",
        content: "내용입니다.",
        image: undefined,
      }),
    );
  });

  it("image가 있으면 postQueries.create에 전달된다", async () => {
    await createPostUseCase({
      spaceId: "space-1",
      authorId: 1,
      category: "material",
      title: "자료",
      content: "내용",
      image: "https://example.com/img.png",
    });

    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ image: "https://example.com/img.png" }));
  });

  it("생성된 postId(UUID)를 반환한다", async () => {
    const { postId } = await createPostUseCase({
      spaceId: "space-1",
      authorId: 1,
      category: "discussion",
      title: "토론",
      content: "내용",
    });

    expect(typeof postId).toBe("string");
    expect(postId).toMatch(/^[0-9a-f-]{36}$/);
  });
});
