"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { CATEGORY_LABELS, type Post, type PostCategory } from "@/entities/post";
import { createPostAction, updatePostAction } from "../actions";

const CATEGORY_STYLE: Record<PostCategory, { active: string; inactive: string }> = {
  notice: {
    active: "bg-blue-500 text-white border-blue-500",
    inactive: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100",
  },
  discussion: {
    active: "bg-purple-500 text-white border-purple-500",
    inactive: "bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100",
  },
  question: {
    active: "bg-amber-500 text-white border-amber-500",
    inactive: "bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100",
  },
  material: {
    active: "bg-emerald-500 text-white border-emerald-500",
    inactive: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100",
  },
};

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
          {(Object.keys(CATEGORY_LABELS) as PostCategory[]).map((cat) => {
            const style = CATEGORY_STYLE[cat];
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setValue("category", cat)}
                className={`rounded-full border px-3.5 py-1 font-bold text-[12px] transition-all ${
                  selectedCategory === cat ? style.active : style.inactive
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-border border-t" />

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
          {...register("title", { required: "제목을 입력해주세요." })}
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
          {...register("content", { required: "내용을 입력해주세요." })}
        />
        {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
      </div>

      {/* 에러 메시지 */}
      {errors.root && <p className="rounded-lg bg-red-50 px-4 py-2.5 text-red-600 text-sm">{errors.root.message}</p>}

      {/* 버튼 */}
      <div className="flex justify-end gap-2 border-border border-t pt-4">
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
