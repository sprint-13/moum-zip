"use client";

import { useRef } from "react";
import { type Control, Controller, type UseFormTrigger } from "react-hook-form";
import type { MoimCreateFormValues } from "@/entities/moim";
import { trackMoimCreateStepCompleted } from "@/features/moim-create/lib/moim-create-events";
import { FieldError } from "@/features/moim-create/ui/moim-form/form-field-error";
import { FormLabel } from "@/features/moim-create/ui/moim-form/form-label";
import { DatePicker, TimePicker } from "@/shared/ui";

type AmplitudeStep = "datetime" | "deadline_datetime";

// 모임 일정(date+time) / 마감(deadlineDate+deadlineTime)만 허용
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
  // date+time 유효성 통과 시 step_completed를 최초 1회만 전송
  // 연속 입력으로 trigger가 중복 실행되는 경우도 방지
  const stepCompletedEventSent = useRef(false);
  const stepValidationRunning = useRef(false);

  const trackStepOnceIfValid = async () => {
    if (stepCompletedEventSent.current || stepValidationRunning.current) return;

    stepValidationRunning.current = true;
    try {
      const isValid = await trigger([dateName, timeName]);

      if (stepCompletedEventSent.current) return;
      if (!isValid) return;

      stepCompletedEventSent.current = true;
      trackMoimCreateStepCompleted(amplitudeStep);
    } finally {
      stepValidationRunning.current = false;
    }
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
