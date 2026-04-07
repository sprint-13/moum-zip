"use client";

import { CategoryTab, FileInput, InputField, InputTextArea } from "@ui/components";
import { RadioGroup, RadioGroupItem } from "@ui/components/shadcn/radio-group";
import Image from "next/image";
import { Controller, type UseFormReturn } from "react-hook-form";
import type { MoimCreateFormValues } from "@/entities/moim";
import { icoProject, icoStudy } from "@/features/moim-create/assets";
import { FormDateTimeRow } from "@/features/moim-create/ui/moim-form/form-date-time-row";
import { FieldError } from "@/features/moim-create/ui/moim-form/form-field-error";
import { FormLabel } from "@/features/moim-create/ui/moim-form/form-label";

type FormMoimSectionProps = {
  form: UseFormReturn<MoimCreateFormValues>;
  onImageUpload: (onChange: (url: string) => void) => Promise<void>;
  isImageUploading?: boolean;
};

export const FormMoimSection = ({ form, onImageUpload, isImageUploading = false }: FormMoimSectionProps) => {
  const {
    control,
    register,
    trigger,
    formState: { errors },
  } = form;
  return (
    <>
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
            className="w-full max-md:max-w-full"
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
            className="w-full max-md:max-w-full"
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
            className="w-full max-md:max-w-full"
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
                    void trigger("image");
                  }}
                  showUploadButton={!field.value}
                  disabled={isImageUploading}
                />

                <FieldError message={fieldState.error?.message} />
              </div>
            )}
          />

          <FormDateTimeRow control={control} dateName="date" timeName="time" label="모임 일정" />
          <FormDateTimeRow control={control} dateName="deadlineDate" timeName="deadlineTime" label="모집 마감 날짜" />
        </div>
      </div>
    </>
  );
};
