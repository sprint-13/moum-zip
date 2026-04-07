"use client";

import { Button } from "@ui/components";
import type { MoimFormState } from "@/features/moim-create/model/types";
import { FieldError } from "@/features/moim-create/ui/moim-form/form-field-error";

type MoimFormActionsProps = {
  state: MoimFormState | null;
  isPending: boolean;
  isImageUploading?: boolean;
  submitLabel: string;
  onCancel: () => void;
};

export const FormActions = ({
  state,
  isPending,
  isImageUploading = false,
  submitLabel,
  onCancel,
}: MoimFormActionsProps) => {
  return (
    <>
      <FieldError message={state?.error} />
      <div className="flex gap-4 pt-5 md:justify-end md:pt-[80px]">
        <Button
          type="button"
          variant="tertiary"
          size="medium"
          className="min-w-0 flex-1 md:max-w-[216px]"
          onClick={onCancel}
          disabled={isPending}
        >
          취소
        </Button>

        <Button
          type="submit"
          variant="primary"
          size="medium"
          className="min-w-0 flex-1 md:w-auto md:max-w-[216px]"
          disabled={isPending || isImageUploading}
        >
          {submitLabel}
        </Button>
      </div>
    </>
  );
};
