import type { PostCategory } from "@/entities/post";

// 카테고리별 UI 메타데이터
export const POST_CATEGORY_META: Record<
  PostCategory,
  {
    description: string;
    guideBadgeClass: string;
    chip: { active: string; inactive: string };
  }
> = {
  notice: {
    description: "스터디 운영에 관한 중요한 공지사항을 작성하세요.",
    guideBadgeClass: "bg-blue-50 text-blue-600 border-blue-100",
    chip: {
      active: "bg-blue-500 text-white border-blue-500",
      inactive: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100",
    },
  },
  discussion: {
    description: "자유롭게 의견을 나누고 토론하는 게시글입니다.",
    guideBadgeClass: "bg-purple-50 text-purple-600 border-purple-100",
    chip: {
      active: "bg-purple-500 text-white border-purple-500",
      inactive: "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100",
    },
  },
  question: {
    description: "학습 중 궁금한 점을 질문하고 답변을 받아보세요.",
    guideBadgeClass: "bg-amber-50 text-amber-600 border-amber-100",
    chip: {
      active: "bg-amber-500 text-white border-amber-500",
      inactive: "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100",
    },
  },
  material: {
    description: "유용한 학습 자료나 링크를 공유하세요.",
    guideBadgeClass: "bg-emerald-50 text-emerald-600 border-emerald-100",
    chip: {
      active: "bg-emerald-500 text-white border-emerald-500",
      inactive: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
    },
  },
};

// 카테고리 렌더링 순서 (Object.keys 순서에 의존하지 않기 위해 명시적으로 선언)
export const POST_CATEGORY_ORDER: PostCategory[] = ["notice", "discussion", "question", "material"];
