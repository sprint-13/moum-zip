"use client";

import { Button, CategoryTab, FileInput, InputField, InputTextArea } from "@ui/components";
import { RadioGroup, RadioGroupItem } from "@ui/components/shadcn/radio-group";
import Image from "next/image";
import { Controller, type UseFormReturn } from "react-hook-form";
import { icoProject, icoStudy } from "@/features/moim-create/assets";
import type { MoimCreateFormValues } from "@/features/moim-create/model/schema";
import { FormDateTimeRow } from "@/features/moim-create/ui/moim-form/form-date-time-row";
import { FieldError } from "@/features/moim-create/ui/moim-form/form-field-error";
import { FormLabel } from "@/features/moim-create/ui/moim-form/form-label";
import { ThemeColorSelect } from "@/features/moim-create/ui/theme-color-select";

interface MoimFormState {
  ok: false;
  error?: string;
}

interface MoimFormFieldsProps {
  form: UseFormReturn<MoimCreateFormValues>;
  onSubmit: (event?: React.BaseSyntheticEvent) => void;
  state: MoimFormState | null;
  isPending: boolean;
  submitLabel: string;
  onCancel: () => void;
  onImageUpload: (onChange: (url: string) => void) => Promise<void>;
}

export const MoimFormFields = ({
  form,
  onSubmit,
  state,
  isPending,
  submitLabel,
  onCancel,
  onImageUpload,
}: MoimFormFieldsProps) => {
  const {
    control,
    register,
    clearErrors,
    formState: { errors },
  } = form;

  return (
    <form className="flex flex-col gap-6 rounded-[40px] bg-white p-8 md:p-[48px]" onSubmit={onSubmit}>
      <h3 className="font-semibold text-foreground text-xl md:text-2xl">모임</h3>

      <div className="flex flex-col justify-between md:flex-row md:gap-[56px]">
        <div className="flex-1 space-y-6">
          <Controller
            control={control}
            name="type"
            render={({ field, fieldState }) => (
              <div>
                <FormLabel label="이 모임은 어떤 종류인가요?" required className="pb-2" />

                <div className="flex gap-5">
                  <CategoryTab
                    illustration={<Image src={icoStudy} alt="" />}
                    label="스터디"
                    selected={field.value === "study"}
                    onClick={() => field.onChange("study")}
                  />
                  <CategoryTab
                    illustration={<Image src={icoProject} alt="" />}
                    label="프로젝트"
                    selected={field.value === "project"}
                    onClick={() => field.onChange("project")}
                  />
                </div>
                <FieldError message={fieldState.error?.message} className="pt-2" />
              </div>
            )}
          />

          <InputField
            label="모임 이름"
            placeholder="모임 이름을 입력해주세요"
            required
            isDestructive={!!errors.name}
            message={errors.name?.message}
            {...register("name")}
          />

          <InputField
            label="모임 정원"
            placeholder="숫자만 입력해주세요"
            type="number"
            required
            min={1}
            max={1000}
            isDestructive={!!errors.capacity}
            message={errors.capacity?.message}
            {...register("capacity", { valueAsNumber: true })}
            onKeyDown={(event) => {
              if (["-", "e", "E", "+"].includes(event.key)) {
                event.preventDefault();
              }
            }}
          />

          <Controller
            control={control}
            name="location"
            render={({ field, fieldState }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                <FormLabel label="장소" required />

                <div className="flex gap-10">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="online" id="online" />
                    <label htmlFor="online">온라인</label>
                  </div>

                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="offline" id="offline" />
                    <label htmlFor="offline">오프라인</label>
                  </div>
                </div>
                <FieldError message={fieldState.error?.message} />
              </RadioGroup>
            )}
          />
        </div>

        <div className="mt-6 flex-1 space-y-6 md:mt-0">
          <InputTextArea
            label="모임 설명"
            placeholder="모임을 설명해주세요"
            required
            isDestructive={!!errors.description}
            message={errors.description?.message}
            {...register("description")}
          />

          <Controller
            control={control}
            name="image"
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <FormLabel label="이미지" required />
                <FileInput
                  onUploadClick={() => onImageUpload(field.onChange)}
                  previewItems={field.value ? [{ id: "1", imageUrl: field.value }] : []}
                  onPreviewRemove={() => {
                    field.onChange("");
                    clearErrors("image");
                  }}
                  showUploadButton={!field.value}
                />

                <FieldError message={fieldState.error?.message} />
              </div>
            )}
          />

          <FormDateTimeRow control={control} dateName="date" timeName="time" label="모임 일정" />
          <FormDateTimeRow control={control} dateName="deadlineDate" timeName="deadlineTime" label="모집 마감 날짜" />
        </div>
      </div>

      <h3 className="font-semibold text-foreground text-xl md:text-2xl">스페이스</h3>

      <div className="flex flex-col justify-between gap-[56px] md:flex-row">
        <div className="max-w-[456px] flex-1">
          <Controller
            control={control}
            name="themeColor"
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <FormLabel label="테마" required />

                <ThemeColorSelect value={field.value} onValueChange={field.onChange} />

                <FieldError message={fieldState.error?.message} />
              </div>
            )}
          />
        </div>
        <div className="flex-1" />
      </div>

      <FieldError message={state?.error} />
      <div className="flex gap-4 pt-[80px] md:justify-end">
        <Button
          type="button"
          variant="tertiary"
          size="medium"
          className="min-w-0 flex-1 md:max-w-[216px]"
          onClick={onCancel}
        >
          취소
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="medium"
          className="min-w-0 flex-1 md:w-auto md:max-w-[216px]"
          disabled={isPending}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
