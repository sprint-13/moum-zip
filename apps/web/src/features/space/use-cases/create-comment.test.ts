import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCommentUseCase } from "./create-comment";

vi.mock("@/entities/post/queries", () => ({
  commentQueries: {
    create: vi.fn(),
  },
  postQueries: {
    findById: vi.fn(),
  },
}));

import { commentQueries, postQueries } from "@/entities/post/queries";

const mockCreate = vi.mocked(commentQueries.create);
const mockFindById = vi.mocked(postQueries.findById);

const BASE_INPUT = {
  postId: "post-1",
  spaceId: "space-1",
  authorId: 42,
  content: "좋은 게시글이네요.",
};

describe("createCommentUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue({ id: "comment-uuid", ...BASE_INPUT, createdAt: new Date(), updatedAt: new Date() });
    mockFindById.mockResolvedValue([{ post: { spaceId: BASE_INPUT.spaceId } } as never]);
  });

  it("commentQueries.create를 올바른 인자로 호출한다", async () => {
    await createCommentUseCase(BASE_INPUT);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        postId: "post-1",
        spaceId: "space-1",
        authorId: 42,
        content: "좋은 게시글이네요.",
      }),
    );
  });

  it("content 앞뒤 공백을 제거한 후 저장한다", async () => {
    await createCommentUseCase({ ...BASE_INPUT, content: "  내용  " });

    expect(mockCreate).toHaveBeenCalledWith(expect.objectContaining({ content: "내용" }));
  });

  it("생성된 commentId(UUID)를 반환한다", async () => {
    const { commentId } = await createCommentUseCase(BASE_INPUT);

    expect(typeof commentId).toBe("string");
    expect(commentId).toBe("comment-uuid");
  });

  it("commentQueries.create 호출 시 id는 UUID 형식이다", async () => {
    await createCommentUseCase(BASE_INPUT);

    const calledId = mockCreate.mock.calls[0]?.[0]?.id;
    expect(calledId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
  });

  it("빈 content이면 에러를 던진다", async () => {
    await expect(createCommentUseCase({ ...BASE_INPUT, content: "" })).rejects.toThrow("댓글 내용을 입력해주세요.");
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("공백만 있는 content이면 에러를 던진다", async () => {
    await expect(createCommentUseCase({ ...BASE_INPUT, content: "   " })).rejects.toThrow("댓글 내용을 입력해주세요.");
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
