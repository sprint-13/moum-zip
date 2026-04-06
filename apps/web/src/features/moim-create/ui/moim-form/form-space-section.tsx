"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import type { MoimCreateFormValues } from "@/features/moim-create/model/schema";
import { FieldError } from "@/features/moim-create/ui/moim-form/form-field-error";
import { FormLabel } from "@/features/moim-create/ui/moim-form/form-label";
import { ThemeColorSelect } from "@/features/moim-create/ui/moim-form/theme-color-select";

type FormSpaceSectionProps = {
  form: UseFormReturn<MoimCreateFormValues>;
};

export const FormSpaceSection = ({ form }: FormSpaceSectionProps) => {
  const { control } = form;

  return (
    <>
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
    </>
  );
};
