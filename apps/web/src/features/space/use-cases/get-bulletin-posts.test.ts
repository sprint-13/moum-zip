import { beforeEach, describe, expect, it, vi } from "vitest";
import { getBulletinPostsUseCase } from "./get-bulletin-posts";

// unstable_cache는 Next.js 서버 런타임에서만 동작하므로 테스트 환경에서 pass-through로 대체
vi.mock("next/cache", () => ({
  unstable_cache: (fn: () => unknown) => fn,
}));

vi.mock("@/entities/post/queries", () => ({
  postQueries: {
    findManyWithTotalBySpaceId: vi.fn(),
  },
}));

import { postQueries } from "@/entities/post/queries";

const mockFindMany = vi.mocked(postQueries.findManyWithTotalBySpaceId);

const mockAuthor = { id: 1, name: "테스트유저", image: null };

import type { PostCategory } from "@/entities/post";

function makeRow(id: string, total: number, category: PostCategory = "notice") {
  return {
    post: {
      id,
      spaceId: "space-1",
      authorId: mockAuthor.id,
      category,
      title: `게시글 ${id}`,
      content: `내용 ${id}`,
      image: null,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: new Date("2026-03-25"),
      updatedAt: new Date("2026-03-25"),
    },
    author: mockAuthor,
    total,
  };
}

describe("getBulletinPostsUseCase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("카테고리 없이 전체 게시글을 반환한다", async () => {
    mockFindMany.mockResolvedValue([makeRow("p1", 2), makeRow("p2", 2, "material")]);

    const result = await getBulletinPostsUseCase("space-1", {});

    expect(result.posts).toHaveLength(2);
    expect(result.posts[0].id).toBe("p1");
    expect(result.posts[0].author.name).toBe("테스트유저");
    expect(result.total).toBe(2);
    expect(result.totalPages).toBe(1);
  });

  it("카테고리 필터가 findManyWithTotalBySpaceId에 전달된다", async () => {
    mockFindMany.mockResolvedValue([]);

    await getBulletinPostsUseCase("space-1", { category: "notice" });

    expect(mockFindMany).toHaveBeenCalledWith("space-1", {
      category: "notice",
      limit: 5,
      offset: 0,
    });
  });

  it("페이지 2 요청 시 offset이 10으로 계산된다", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await getBulletinPostsUseCase("space-1", { page: 2 });

    expect(mockFindMany).toHaveBeenCalledWith("space-1", {
      category: undefined,
      limit: 5,
      offset: 5,
    });
    // rows가 없으면 total = 0
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
  });

  it("rows의 total 필드에서 전체 수를 읽어 totalPages를 계산한다", async () => {
    // 15개 중 첫 10개 — total은 window 함수가 반환한 15
    mockFindMany.mockResolvedValue(Array.from({ length: 10 }, (_, i) => makeRow(`p${i}`, 15)));

    const result = await getBulletinPostsUseCase("space-1", { page: 1 });

    expect(result.total).toBe(15);
    expect(result.totalPages).toBe(3);
  });

  it("게시글이 없으면 total 0, 빈 배열을 반환한다", async () => {
    mockFindMany.mockResolvedValue([]);

    const result = await getBulletinPostsUseCase("space-1", {});

    expect(result.posts).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(0);
  });

  it("rows의 post와 author를 합쳐 Post 배열로 반환한다", async () => {
    mockFindMany.mockResolvedValue([makeRow("p1", 1, "discussion")]);

    const result = await getBulletinPostsUseCase("space-1", {});

    expect(result.posts[0]).toMatchObject({
      id: "p1",
      category: "discussion",
      author: { id: 1, name: "테스트유저" },
    });
  });
});
