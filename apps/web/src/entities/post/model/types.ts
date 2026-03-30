import type { SpacePost, SpacePostComment } from "@/shared/db/scheme";

export type PostCategory = SpacePost["category"];

export interface Author {
  id: number;
  name: string;
  image: string | null;
}

/** spacePosts 레코드 + spaceMembers 조인으로 완성되는 도메인 타입 */
export interface Post {
  id: string;
  spaceId: string;
  authorId: number;
  author: Author;
  category: PostCategory;
  title: string;
  content: string;
  image: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}

/** spacePostComments 레코드 + spaceMembers 조인으로 완성되는 도메인 타입 */
export interface Comment {
  id: string;
  postId: string;
  spaceId: string;
  authorId: number;
  author: Author;
  content: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  notice: "공지",
  discussion: "토론",
  question: "질문",
  material: "자료",
};

export type { SpacePostComment };
