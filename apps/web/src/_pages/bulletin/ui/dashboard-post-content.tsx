"use client";

import { useRouter } from "next/navigation";
import type { Post } from "@/entities/post";
import { SpaceBodyContent } from "@/features/space/ui/space-body-content";
import { PostItem } from "./post-item";

export const DashboardPostContent = ({ posts, slug }: { posts: Post[]; slug: string }) => {
  const router = useRouter();
  return (
    <SpaceBodyContent title="게시글" onOpen={() => router.push(`/${slug}/bulletin`)}>
      {posts.length === 0 ? (
        <p className="py-4 text-center text-neutral-400 text-sm">등록된 게시글이 없습니다.</p>
      ) : (
        <ul className="flex w-full flex-col gap-3">
          {posts.slice(0, 4).map((post: Post) => (
            <li key={post.id} className="w-full">
              <PostItem post={post} slug={slug} />
            </li>
          ))}
        </ul>
      )}
    </SpaceBodyContent>
  );
};
