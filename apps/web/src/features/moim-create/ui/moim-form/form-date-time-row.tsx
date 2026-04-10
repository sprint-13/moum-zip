"use client";

import { useRef } from "react";
import { type Control, Controller, type UseFormTrigger } from "react-hook-form";
import type { MoimCreateFormValues } from "@/entities/moim";
import { trackMoimCreateEvent } from "@/features/moim-create/lib/moim-create-events";
import { FieldError } from "@/features/moim-create/ui/moim-form/form-field-error";
import { FormLabel } from "@/features/moim-create/ui/moim-form/form-label";
import { DatePicker, TimePicker } from "@/shared/ui";

type AmplitudeStep = "datetime" | "deadline_datetime";

// 모임 일정(date+time) / 마감(deadlineDate+deadlineTime)만 허용 — 유니온으로 고정
type FormDateTimeRowProps = {
  control: Control<MoimCreateFormValues>;
  label: string;
  trigger: UseFormTrigger<MoimCreateFormValues>;
  amplitudeStep: AmplitudeStep;
} & ({ dateName: "date"; timeName: "time" } | { dateName: "deadlineDate"; timeName: "deadlineTime" });

export const FormDateTimeRow = ({
  control,
  dateName,
  timeName,
  label,
  amplitudeStep,
  trigger,
}: FormDateTimeRowProps) => {
  // 같은 행에서 step_completed 이벤트는 최초 1회만 전송
  // onChange가 반복되므로, 검증 통과 시 최초 1회만 전송
  const stepCompletedEventSent = useRef(false);

  const trackStepOnceIfValid = async () => {
    if (stepCompletedEventSent.current) return;

    const isValid = await trigger([dateName, timeName]);
    if (!isValid) return;

    stepCompletedEventSent.current = true;
    trackMoimCreateEvent("moim_create_step_completed", { step: amplitudeStep });
  };

  return (
    <>
      <FormLabel label={label} required className="pb-2" />

      <div className="flex flex-col gap-4 md:flex-row">
        <Controller
          control={control}
          name={dateName}
          render={({ field, fieldState }) => (
            <div className="flex flex-1 flex-col gap-2">
              <DatePicker
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  void trackStepOnceIfValid();
                }}
              />
              <FieldError message={fieldState.error?.message} />
            </div>
          )}
        />

        <Controller
          control={control}
          name={timeName}
          render={({ field, fieldState }) => (
            <div className="flex flex-1 flex-col gap-2">
              <TimePicker
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                  void trackStepOnceIfValid();
                }}
              />
              <FieldError message={fieldState.error?.message} />
            </div>
          )}
        />
      </div>
    </>
  );
};
