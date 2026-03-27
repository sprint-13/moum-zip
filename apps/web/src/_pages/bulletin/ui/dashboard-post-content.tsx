import type { Post } from "@/entities/post";
import { SpaceBodyContent } from "@/features/space/ui/space-body-content";
import { PostItem } from "./post-item";

export const DashboardPostContent = ({ posts, slug }: { posts: Post[]; slug: string }) => {
  return (
    <SpaceBodyContent title="게시글">
      <ul className="flex w-full flex-col gap-3">
        {posts.slice(0, 4).map((post: Post) => (
          <li key={post.id} className="w-full">
            <PostItem post={post} slug={slug} />
          </li>
        ))}
      </ul>
    </SpaceBodyContent>
  );
};
