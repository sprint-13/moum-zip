import { Pencil } from "@moum-zip/ui/icons";
import { BulletinInfoCard, BulletinPopularPostCard, BulletinTable } from "@/_pages/bulletin";
import type { Post } from "@/entities/post";
import { SpaceBody, SpaceBodyLeft, SpaceBodyRight, SpaceHeader } from "@/features/space";

const WritePostButton = (
  <button
    type="button"
    className="flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 font-medium text-foreground text-sm transition-colors hover:bg-muted"
  >
    <Pencil className="size-4" />
    글쓰기
  </button>
);

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: "공간 이용 가이드 및 필독 공지",
    content:
      "우리 스페이스를 처음 방문하신 분들은 이 가이드를 꼭 읽어주세요. 이용 규칙과 에티켓이 포함되어 있습니다. 우리 스페이스를 처음 방문하신 분들은 이 가이드를 꼭 읽어주세요. 우리 스페이스를 처음 방문하신 분들은 이 가이드를 꼭 읽어주세요. 이용 규칙과 에티켓이 포함되어 있습니다. 우리 스페이스를 처음 방문하신 분들은 이 가이드를 꼭 읽어주세요. 이용 규칙과 에티켓이 포함되어 있습니다. 이용 규칙과 에티켓이 포함되어 있습니다.우리 스페이스를 처음 방문하신 분들은 이 가이드를 꼭 읽어주세요. 이용 규칙과 에티켓이 포함되어 있습니다.",
    authorId: 101, // Manager
    image: "https://images.unsplash.com/photo-1434031216350-7974aa601d55?q=80&w=1000",
    viewCount: 154,
    likeCount: 12,
    createdAt: new Date("2026-01-20T10:00:00Z"),
    updatedAt: new Date("2026-01-20T10:00:00Z"),
    category: "notice",
  },
  {
    id: 2,
    title: "다음 오프라인 모임 장소 투표합니다!",
    content: "강남역 근처와 성수동 중에 어디가 더 편하신가요? 댓글로 의견 남겨주세요.",
    authorId: 102, // Moderator
    image: null,
    viewCount: 89,
    likeCount: 24,
    createdAt: new Date("2026-02-15T14:30:00Z"),
    updatedAt: new Date("2026-02-16T09:00:00Z"),
    category: "discussion",
  },
  {
    id: 3,
    title: "Next.js App Router에서 서버 컴포넌트 에러 질문",
    content: "서버 컴포넌트 내부에서 쿠키를 읽으려 할 때 가끔 빌드 에러가 나는데, 다들 어떻게 해결하시나요?",
    authorId: 103, // Member
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=1000",
    viewCount: 45,
    likeCount: 3,
    createdAt: new Date("2026-03-05T11:20:00Z"),
    updatedAt: new Date("2026-03-05T11:20:00Z"),
    category: "question",
  },
  {
    id: 4,
    title: "Drizzle ORM 공식 문서 한글 요약본 공유",
    content: "개인적으로 공부하면서 정리한 Drizzle 핵심 문법입니다. 필요하신 분들 다운로드 하세요.",
    authorId: 105, // Member
    image: null,
    viewCount: 210,
    likeCount: 56,
    createdAt: new Date("2026-03-10T16:00:00Z"),
    updatedAt: new Date("2026-03-12T10:00:00Z"),
    category: "material",
  },
  {
    id: 5,
    title: "신규 멤버 환영회 날짜 변경 안내",
    content: "기존 금요일에서 토요일 저녁 7시로 변경되었습니다. 착오 없으시길 바랍니다.",
    authorId: 101,
    image: null,
    viewCount: 67,
    likeCount: 5,
    createdAt: new Date("2026-03-15T13:00:00Z"),
    updatedAt: new Date("2026-03-15T13:00:00Z"),
    category: "notice",
  },
  {
    id: 6,
    title: "프론트엔드 성능 최적화 방법론 토론",
    content: "LCP를 줄이기 위해 가장 효과적이었던 전략이 무엇이었나요? 서로의 노하우를 공유해봅시다.",
    authorId: 104,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000",
    viewCount: 122,
    likeCount: 18,
    createdAt: new Date("2026-03-18T20:15:00Z"),
    updatedAt: new Date("2026-03-18T20:15:00Z"),
    category: "discussion",
  },
  {
    id: 7,
    title: "Tailwind CSS에서 동적 클래스 적용이 안 됩니다.",
    content: "문자열 템플릿으로 클래스를 생성하면 스타일이 안 먹는데, 혹시 Safelist를 써야 하는 걸까요?",
    authorId: 103,
    image: null,
    viewCount: 32,
    likeCount: 1,
    createdAt: new Date("2026-03-20T12:00:00Z"),
    updatedAt: new Date("2026-03-20T12:45:00Z"),
    category: "question",
  },
  {
    id: 8,
    title: "[자료] 2026년 웹 트렌드 리포트 PDF",
    content: "해외 매체에서 발표한 올해의 웹 기술 트렌드 리포트 공유합니다. 분량이 꽤 많네요.",
    authorId: 102,
    image: "https://images.unsplash.com/photo-1553484771-047a44eee27f?q=80&w=1000",
    viewCount: 340,
    likeCount: 82,
    createdAt: new Date("2026-03-22T09:30:00Z"),
    updatedAt: new Date("2026-03-22T09:30:00Z"),
    category: "material",
  },
  {
    id: 9,
    title: "모노레포 구축 시 패키지 매니저 추천해주세요.",
    content: "pnpm vs bun... 대규모 프로젝트에서 어떤 게 더 안정적일까요?",
    authorId: 105,
    image: null,
    viewCount: 77,
    likeCount: 9,
    createdAt: new Date("2026-03-23T15:10:00Z"),
    updatedAt: new Date("2026-03-23T15:10:00Z"),
    category: "discussion",
  },
  {
    id: 10,
    title: "서버리스 환경에서 DB 커넥션 풀 관리",
    content: "Neon이나 Prisma Accelerate 쓰시는 분들 후기 궁금합니다. 오버헤드 체감이 심한가요?",
    authorId: 104,
    image: null,
    viewCount: 51,
    likeCount: 14,
    createdAt: new Date("2026-03-24T22:00:00Z"),
    updatedAt: new Date("2026-03-25T10:00:00Z"),
    category: "question",
  },
];
// TODO: post 리스트 어디서 받을지 , 카테고리별 필터링, 페이지네이션 등 기능 추가하기
// TODO: 인기 게시물 받아오기 없을 경우 최신글로 대체하기
export default function BulletinPage() {
  return (
    <>
      <SpaceHeader
        title="게시판"
        description="공지, 토론 스레드, 학습 게시글을 확인하세요."
        buttonGroup={WritePostButton}
      />
      <SpaceBody>
        <SpaceBodyLeft>
          <BulletinTable posts={MOCK_POSTS} />
        </SpaceBodyLeft>
        <SpaceBodyRight>
          <BulletinInfoCard />
          <BulletinPopularPostCard />
        </SpaceBodyRight>
      </SpaceBody>
    </>
  );
}
