"use client";

import { CheckIcon } from "@ui/icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { POST_CATEGORY_META, POST_CATEGORY_ORDER } from "@/_pages/bulletin/model/post-category-meta";
import { CATEGORY_LABELS, type Post, type PostCategory } from "@/entities/post";
import { getQueryClient } from "@/shared/lib/get-query-client";
import { createPostAction, updatePostAction } from "../actions";
import { bulletinQueryKeys } from "../model/query-keys";

interface PostWriteFormProps {
  slug: string;
  initialPost?: Pick<Post, "id" | "title" | "content" | "category">;
}
interface PostWriteFormValues {
  category: PostCategory;
  title: string;
  content: string;
}

export function PostWriteForm({ slug, initialPost }: PostWriteFormProps) {
  const router = useRouter();
  const queryClient = getQueryClient();
  const [isPending, startTransition] = useTransition();
  const isEdit = !!initialPost;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    setError,
  } = useForm<PostWriteFormValues>({
    defaultValues: {
      category: initialPost?.category ?? "notice",
      title: initialPost?.title ?? "",
      content: initialPost?.content ?? "",
    },
  });

  const selectedCategory = watch("category");

  const onSubmit = (values: PostWriteFormValues) => {
    const formData = new FormData();
    formData.set("category", values.category);
    formData.set("title", values.title);
    formData.set("content", values.content);

    startTransition(async () => {
      try {
        if (isEdit && initialPost) {
          const { postId } = await updatePostAction(slug, initialPost.id, formData);
          queryClient.invalidateQueries({ queryKey: bulletinQueryKeys.all(slug) });
          router.push(`/${slug}/bulletin/${postId}`);
          return;
        }

        const { postId } = await createPostAction(slug, formData);
        router.push(`/${slug}/bulletin/${postId}`);
      } catch (err) {
        setError("root", {
          message: err instanceof Error ? err.message : "게시글 저장에 실패했습니다.",
        });
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 rounded-xl border border-border bg-background p-6"
    >
      {/* 카테고리 */}
      <div className="flex flex-col gap-2.5">
        <span className="font-semibold text-neutral-700 text-sm">카테고리</span>
        <div className="flex flex-wrap gap-2">
          {POST_CATEGORY_ORDER.map((cat) => {
            const { chip } = POST_CATEGORY_META[cat];
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={selectedCategory === cat}
                onClick={() => setValue("category", cat)}
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-bold text-[12px] transition-all ${
                  selectedCategory === cat ? `${chip.active} shadow-md` : chip.inactive
                }`}
              >
                {selectedCategory === cat && <CheckIcon size={14} />}
                {CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 제목 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="font-semibold text-neutral-700 text-sm">
          제목
        </label>
        <input
          id="title"
          type="text"
          placeholder="제목을 입력하세요"
          disabled={isPending}
          className="rounded-lg border border-border bg-background px-4 py-3 text-[15px] text-foreground outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
          {...register("title", {
            validate: (value) => value.trim().length > 0 || "제목을 입력해주세요.",
          })}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      {/* 내용 */}
      <div className="flex flex-col gap-2">
        <label htmlFor="content" className="font-semibold text-neutral-700 text-sm">
          내용
        </label>
        <textarea
          id="content"
          placeholder="내용을 자유롭게 작성하세요"
          rows={14}
          disabled={isPending}
          className="resize-none rounded-lg border border-border bg-background px-4 py-3 text-[15px] text-foreground leading-relaxed outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
          {...register("content", {
            validate: (value) => value.trim().length > 0 || "내용을 입력해주세요.",
          })}
        />
        {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
      </div>

      {/* 에러 메시지 */}
      {errors.root && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-red-600 text-sm">{errors.root.message}</p>}

      {/* 버튼 */}
      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
          className="rounded-lg border border-border px-5 py-2 font-medium text-neutral-600 text-sm transition-colors hover:bg-muted disabled:opacity-50"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-primary px-6 py-2 font-medium text-primary-foreground text-sm transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isPending ? "저장 중..." : isEdit ? "수정 완료" : "게시글 등록"}
        </button>
      </div>
    </form>
  );
}
