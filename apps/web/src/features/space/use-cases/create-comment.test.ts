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

vi.mock("@/features/notification/use-cases/create-notification", () => ({
  createNotification: vi.fn(),
}));

import { commentQueries, postQueries } from "@/entities/post/queries";
import { createNotification } from "@/features/notification/use-cases/create-notification";

const mockCreate = vi.mocked(commentQueries.create);
const mockFindById = vi.mocked(postQueries.findById);
const mockCreateNotification = vi.mocked(createNotification);

const BASE_INPUT = {
  postId: "post-1",
  spaceId: "space-1",
  authorId: 42,
  content: "좋은 게시글이네요.",
};

describe("createCommentUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockCreate.mockResolvedValue({
      id: "comment-uuid",
      ...BASE_INPUT,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    mockFindById.mockResolvedValue([
      {
        post: {
          id: BASE_INPUT.postId,
          spaceId: BASE_INPUT.spaceId,
          title: "테스트 게시글",
        },
        author: {
          id: 7,
          name: "작성자",
          image: null,
        },
      } as never,
    ]);

    mockCreateNotification.mockResolvedValue({} as never);
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

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        content: "내용",
      }),
    );
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

  it("게시글 작성자와 댓글 작성자가 다르면 알림을 생성한다", async () => {
    await createCommentUseCase(BASE_INPUT);

    expect(mockCreateNotification).toHaveBeenCalledWith({
      teamId: "space-1",
      userId: 7,
      type: "COMMENT",
      message: "내 게시글에 새 댓글이 달렸어요.",
      data: {
        postId: "post-1",
        postTitle: "테스트 게시글",
        commentId: "comment-uuid",
      },
    });
  });

  it("게시글 작성자와 댓글 작성자가 같으면 알림을 생성하지 않는다", async () => {
    mockFindById.mockResolvedValue([
      {
        post: {
          id: BASE_INPUT.postId,
          spaceId: BASE_INPUT.spaceId,
          title: "테스트 게시글",
        },
        author: {
          id: BASE_INPUT.authorId,
          name: "작성자",
          image: null,
        },
      } as never,
    ]);

    await createCommentUseCase(BASE_INPUT);

    expect(mockCreateNotification).not.toHaveBeenCalled();
  });
});
