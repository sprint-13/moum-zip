import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPostUseCase } from "./create-post";

vi.mock("@/entities/post/queries", () => ({
  postQueries: {
    create: vi.fn(),
  },
}));

vi.mock("@/features/notification/use-cases/create-space-member-notifications", () => ({
  createSpaceMemberNotifications: vi.fn(),
}));

import { postQueries } from "@/entities/post/queries";
import { createSpaceMemberNotifications } from "@/features/notification/use-cases/create-space-member-notification";

const mockCreate = vi.mocked(postQueries.create);
const mockCreateSpaceMemberNotifications = vi.mocked(createSpaceMemberNotifications);

describe("createPostUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCreate.mockResolvedValue([]);
    mockCreateSpaceMemberNotifications.mockResolvedValue(undefined);
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

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        image: "https://example.com/img.png",
      }),
    );
  });

  it("게시글 생성 후 스페이스 멤버 알림을 생성한다", async () => {
    await createPostUseCase({
      spaceId: "space-1",
      authorId: 7,
      category: "discussion",
      title: "새 글",
      content: "본문",
      image: "https://example.com/post.png",
    });

    expect(mockCreateSpaceMemberNotifications).toHaveBeenCalledWith({
      spaceId: "space-1",
      actorId: 7,
      type: "SPACE_POST_CREATED",
      message: "새 게시글이 등록되었어요: 새 글",
      data: {
        postId: expect.any(String),
        postTitle: "새 글",
        image: "https://example.com/post.png",
      },
    });
  });

  it("image가 없으면 알림 data.image에 null을 전달한다", async () => {
    await createPostUseCase({
      spaceId: "space-1",
      authorId: 7,
      category: "discussion",
      title: "이미지 없는 글",
      content: "본문",
    });

    expect(mockCreateSpaceMemberNotifications).toHaveBeenCalledWith({
      spaceId: "space-1",
      actorId: 7,
      type: "SPACE_POST_CREATED",
      message: "새 게시글이 등록되었어요: 이미지 없는 글",
      data: {
        postId: expect.any(String),
        postTitle: "이미지 없는 글",
        image: null,
      },
    });
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

  it("postQueries.create와 알림 생성에 같은 postId를 사용한다", async () => {
    const { postId } = await createPostUseCase({
      spaceId: "space-1",
      authorId: 3,
      category: "notice",
      title: "동일 id 확인",
      content: "내용",
    });

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        id: postId,
      }),
    );

    expect(mockCreateSpaceMemberNotifications).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          postId,
        }),
      }),
    );
  });
});
