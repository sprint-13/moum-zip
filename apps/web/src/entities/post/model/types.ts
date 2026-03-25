import type { SpacePost } from "@/shared/db/scheme";

interface PostExt {
  id: number;
  /** 소속 게시판 ID */
  title: string;
  content: string;
  authorId: number; // Member.id
  image: string | null;
  viewCount: number;
  likeCount: number;
  createdAt: Date; // ISO 날짜 문자열
  updatedAt: Date; // ISO 날짜 문자열
}

export interface CommentExt {
  id: number;
  postId: number;
  authorId: number; // Member.id
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PostCategory = SpacePost["category"];

export interface Post extends PostExt {
  category: PostCategory;
}

export const CATEGORY_LABELS: Record<PostCategory, string> = {
  notice: "공지",
  discussion: "토론",
  question: "질문",
  material: "자료",
};
