"use client";

import { type Control, Controller } from "react-hook-form";
import type { MoimCreateFormValues } from "@/features/moim-create/model/schema";
import { FieldError } from "@/features/moim-create/ui/moim-form/form-field-error";
import { FormLabel } from "@/features/moim-create/ui/moim-form/form-label";
import { DatePicker, TimePicker } from "@/shared/ui";

// 모임 일정(date+time) / 마감(deadlineDate+deadlineTime)만 허용 — 유니온으로 고정
type MoimDateTimeRowProps = {
  control: Control<MoimCreateFormValues>;
  label: string;
} & ({ dateName: "date"; timeName: "time" } | { dateName: "deadlineDate"; timeName: "deadlineTime" });

export const FormDateTimeRow = ({ control, dateName, timeName, label }: MoimDateTimeRowProps) => {
  return (
    <>
      <FormLabel label={label} required className="pb-2" />

      <div className="flex max-w-[456px] flex-col gap-4 md:flex-row">
        <Controller
          control={control}
          name={dateName}
          render={({ field, fieldState }) => (
            <div className="flex flex-1 flex-col gap-2">
              <DatePicker value={field.value} onChange={field.onChange} />
              <FieldError message={fieldState.error?.message} />
            </div>
          )}
        />

        <Controller
          control={control}
          name={timeName}
          render={({ field, fieldState }) => (
            <div className="flex flex-1 flex-col gap-2">
              <TimePicker value={field.value} onChange={field.onChange} />
              <FieldError message={fieldState.error?.message} />
            </div>
          )}
        />
      </div>
    </>
  );
};
