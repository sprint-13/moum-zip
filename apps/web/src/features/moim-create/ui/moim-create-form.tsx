"use client";

import { Button, CategoryTab, FileInput, InputField, InputTextArea } from "@ui/components";
import { RadioGroup, RadioGroupItem } from "@ui/components/shadcn/radio-group";
import Image from "next/image";
import { Controller } from "react-hook-form";
import { DatePicker, icoProject, icoStudy, TimePicker } from "@/_pages/moim-create";
import { uploadImage } from "@/_pages/moim-create/use-cases/upload-image";
import { useMoimCreateForm } from "@/features/moim-create/model/use-moim-create-form";
import { ThemeColorSelect } from "@/features/moim-create/ui/theme-color-select";

// 파일 선택 후 S3 업로드 → publicUrl 반환
const handleImageUpload = async (onChange: (url: string) => void) => {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/jpeg,image/png,image/webp,image/gif";
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    const publicUrl = await uploadImage(file);
    onChange(publicUrl);
  };
  input.click();
};

export const MoimCreateForm = () => {
  const { form, onSubmit, state, isPending } = useMoimCreateForm();
  const {
    control,
    register,

    formState: { errors },
  } = form;

  return (
    <form className="flex flex-col gap-6 rounded-[40px] bg-white p-8 md:p-[48px]" onSubmit={onSubmit}>
      {/* 모임 */}
      <h3 className="font-semibold text-foreground text-xl md:text-2xl">모임</h3>
      <div className="flex flex-col justify-between md:flex-row md:gap-[56px]">
        <div className="flex-1 space-y-6">
          <Controller
            control={control}
            name="type"
            render={({ field, fieldState }) => (
              <div>
                <p className="pb-2 font-semibold text-foreground text-sm leading-[1.2]">
                  이 모임은 어떤 종류인가요?<span className="pl-1 text-primary">*</span>
                </p>
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
                {fieldState.error && (
                  <p className="pt-2 font-medium text-destructive text-sm leading-[1.2]">{fieldState.error.message}</p>
                )}
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
            isDestructive={!!errors.capacity}
            message={errors.capacity?.message}
            {...register("capacity", { valueAsNumber: true })}
          />

          <Controller
            control={control}
            name="location"
            render={({ field, fieldState }) => (
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                <p className="font-semibold text-foreground text-sm leading-[1.2]">
                  장소<span className="pl-1 text-primary">*</span>
                </p>
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
                {fieldState.error && (
                  <p className="font-medium text-destructive text-sm leading-[1.2]">{fieldState.error.message}</p>
                )}
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
                <p className="font-semibold text-foreground text-sm leading-[1.2]">
                  이미지<span className="pl-1 text-primary">*</span>
                </p>
                <FileInput
                  onUploadClick={() => handleImageUpload(field.onChange)}
                  previewItems={field.value ? [{ id: "1", imageUrl: field.value }] : []}
                  onPreviewRemove={() => field.onChange("")}
                  showUploadButton={!field.value}
                />
                {fieldState.error && (
                  <p className="font-medium text-destructive text-sm leading-[1.2]">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
          <div>
            <p className="pb-2 font-semibold text-foreground text-sm leading-[1.2]">
              모임 일정<span className="pl-1 text-primary">*</span>
            </p>
            <div className="flex max-w-[456px] flex-col gap-4 md:flex-row">
              <Controller
                control={control}
                name="date"
                render={({ field, fieldState }) => (
                  <div className="flex flex-1 flex-col gap-2">
                    <DatePicker value={field.value} onChange={field.onChange} />
                    {fieldState.error && (
                      <p className="font-medium text-destructive text-sm leading-[1.2]">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
              <Controller
                control={control}
                name="time"
                render={({ field, fieldState }) => (
                  <div className="flex flex-1 flex-col gap-2">
                    <TimePicker value={field.value} onChange={field.onChange} />
                    {fieldState.error && (
                      <p className="font-medium text-destructive text-sm leading-[1.2]">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
          <div>
            <p className="pb-2 font-semibold text-foreground text-sm leading-[1.2]">
              모집 마감 날짜<span className="pl-1 text-primary">*</span>
            </p>
            <div className="flex max-w-[456px] flex-col gap-4 md:flex-row">
              <Controller
                control={control}
                name="deadlineDate"
                render={({ field, fieldState }) => (
                  <div className="flex flex-1 flex-col gap-2">
                    <DatePicker value={field.value} onChange={field.onChange} />
                    {fieldState.error && (
                      <p className="font-medium text-destructive text-sm leading-[1.2]">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
              <Controller
                control={control}
                name="deadlineTime"
                render={({ field, fieldState }) => (
                  <div className="flex flex-1 flex-col gap-2">
                    <TimePicker value={field.value} onChange={field.onChange} />
                    {fieldState.error && (
                      <p className="font-medium text-destructive text-sm leading-[1.2]">{fieldState.error.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 스페이스 */}
      <h3 className="font-semibold text-foreground text-xl md:text-2xl">스페이스</h3>
      <div className="flex flex-col justify-between gap-[56px] md:flex-row">
        <div className="max-w-[456px] flex-1">
          <Controller
            control={control}
            name="themeColor"
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-2">
                <p className="font-semibold text-foreground text-sm leading-[1.2]">
                  테마<span className="pl-1 text-primary">*</span>
                </p>
                <ThemeColorSelect value={field.value} onValueChange={field.onChange} />
                {fieldState.error && (
                  <p className="font-medium text-destructive text-sm leading-[1.2]">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />
        </div>
        <div className="flex-1" />
      </div>

      {/*  서버 에러 메시지 */}
      {state && !state.ok && <p className="font-medium text-destructive text-sm">{state.error}</p>}

      {/* 버튼 */}
      <div className="flex gap-4 pt-[80px] md:justify-end">
        <Button variant="tertiary" size="medium" className="min-w-0 flex-1 md:max-w-[216px]">
          취소
        </Button>

        <Button type="submit" variant="primary" size="medium" className="min-w-0 flex-1 md:w-auto md:max-w-[216px]">
          {isPending ? "생성 중" : "모임 만들기"}
        </Button>
      </div>
    </form>
  );
};
