import { Heart } from "@moum-zip/ui/icons";
import Link from "next/link";
import { SpaceCard } from "@/features/space";
import { getPopularPostsUseCase } from "@/features/space/use-cases/get-popular-posts";

interface BulletinPopularPostCardProps {
  spaceId: string;
  slug: string;
}

export const BulletinPopularPostCard = async ({ spaceId, slug }: BulletinPopularPostCardProps) => {
  const posts = await getPopularPostsUseCase(spaceId);

  return (
    <SpaceCard>
      <h2 className="mb-4 font-bold text-[18px] text-neutral-900">인기 게시글</h2>
      {posts.length === 0 ? (
        <p className="text-center text-neutral-400 text-sm">아직 게시글이 없습니다.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {posts.map((post, index) => (
            <PopularPost
              key={post.id}
              rank={index + 1}
              title={post.title}
              likes={post.likeCount}
              href={`/${slug}/bulletin/${post.id}`}
            />
          ))}
        </div>
      )}
    </SpaceCard>
  );
};

function PopularPost({ rank, title, likes, href }: { rank: number; title: string; likes: number; href: string }) {
  return (
    <Link href={href} className="group flex cursor-pointer items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 font-bold text-[14px] text-white">
        {rank}
      </div>
      <div className="flex flex-col gap-0.5">
        <h3 className="line-clamp-1 font-semibold text-[15px] text-neutral-900 transition-colors group-hover:text-emerald-600">
          {title}
        </h3>
        <p className="inline-flex items-center gap-1 font-medium text-[12px] text-neutral-400">
          <Heart size={11} />
          {likes}
        </p>
      </div>
    </Link>
  );
}
