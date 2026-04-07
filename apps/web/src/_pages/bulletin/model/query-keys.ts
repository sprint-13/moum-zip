import type { PostCategory } from "@/entities/post";

export const bulletinQueryKeys = {
  all: (slug: string) => ["bulletin", slug] as const,
  list: (slug: string, opts: { page: number; filter?: PostCategory }) =>
    [...bulletinQueryKeys.all(slug), opts] as const,
  detail: (slug: string, postId: string) => [...bulletinQueryKeys.all(slug), "detail", postId] as const,
  comments: (slug: string, postId: string) => [...bulletinQueryKeys.all(slug), "comments", postId] as const,
};
