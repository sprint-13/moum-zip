"use client";

import type { UseFormReturn } from "react-hook-form";
import type { MoimCreateFormValues } from "@/features/moim-create/model/schema";
import { FormActions } from "@/features/moim-create/ui/moim-form/form-actions";
import { FormMoimSection } from "@/features/moim-create/ui/moim-form/form-moim-section";
import { FormSpaceSection } from "@/features/moim-create/ui/moim-form/form-space-section";

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
  return (
    <form className="flex flex-col gap-6 rounded-3xl bg-white p-8 md:rounded-[40px] md:p-[48px]" onSubmit={onSubmit}>
      <FormMoimSection form={form} onImageUpload={onImageUpload} />
      <FormSpaceSection form={form} />
      <FormActions state={state} isPending={isPending} submitLabel={submitLabel} onCancel={onCancel} />
    </form>
  );
};
