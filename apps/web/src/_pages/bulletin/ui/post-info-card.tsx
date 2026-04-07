import { Eye, Heart, MessageSquare } from "@moum-zip/ui/icons";
import type { ReactNode } from "react";
import { CATEGORY_LABELS, type Post } from "@/entities/post";
import { SpaceCard } from "@/features/space";
import { getPostInfo } from "@/features/space/use-cases/get-post-detail";

const CATEGORY_COLOR: Record<Post["category"], string> = {
  notice: "bg-blue-50 text-blue-600 border-blue-100",
  discussion: "bg-purple-50 text-purple-600 border-purple-100",
  question: "bg-amber-50 text-amber-600 border-amber-100",
  material: "bg-emerald-50 text-emerald-600 border-emerald-100",
};

interface PostInfoCardProps {
  postId: string;
}

export async function PostInfoCard({ postId }: PostInfoCardProps) {
  const post = await getPostInfo(postId);

  return (
    <SpaceCard>
      <h3 className="mb-4 font-bold text-base text-neutral-900">게시글 정보</h3>
      <dl className="flex flex-col gap-3 text-sm">
        <InfoRow label="카테고리">
          <span className={`rounded-full border px-2.5 py-0.5 font-bold text-[11px] ${CATEGORY_COLOR[post.category]}`}>
            {CATEGORY_LABELS[post.category]}
          </span>
        </InfoRow>
        <InfoRow label="작성자">{post.author.name}</InfoRow>
        <InfoRow label="작성일">
          {post.createdAt?.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
        </InfoRow>
        <div className="mt-2 flex justify-around border-border border-t pt-3 text-neutral-500">
          <Stat icon={<Heart size={14} />} value={post.likeCount} />
          <Stat icon={<MessageSquare size={14} />} value={post.commentCount} />
          <Stat icon={<Eye size={14} />} value={post.viewCount} />
        </div>
      </dl>
    </SpaceCard>
  );
}

function InfoRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-neutral-400">{label}</dt>
      <dd className="font-medium text-neutral-700">{children}</dd>
    </div>
  );
}

function Stat({ icon, value }: { icon: ReactNode; value: number }) {
  return (
    <div className="flex items-center gap-1">
      {icon}
      <span className="font-medium text-[12px]">{value}</span>
    </div>
  );
}
