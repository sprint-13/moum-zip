import { POST_CATEGORY_META, POST_CATEGORY_ORDER } from "@/_pages/bulletin/model/post-category-meta";
import { CATEGORY_LABELS, type PostCategory } from "@/entities/post";
import { SpaceCard } from "@/features/space";

export const PostCategoryGuideCard = () => {
  return (
    <SpaceCard>
      <h3 className="mb-4 font-bold text-base text-neutral-900">카테고리 안내</h3>
      <ul className="flex flex-col gap-3">
        {POST_CATEGORY_ORDER.map((cat: PostCategory) => {
          const { description, guideBadgeClass } = POST_CATEGORY_META[cat];
          return (
            <li key={cat} className="flex flex-col gap-1">
              <span className={`w-fit rounded-full border px-2.5 py-0.5 font-bold text-[11px] ${guideBadgeClass}`}>
                {CATEGORY_LABELS[cat]}
              </span>
              <p className="text-[13px] text-neutral-500 leading-relaxed">{description}</p>
            </li>
          );
        })}
      </ul>
    </SpaceCard>
  );
};
