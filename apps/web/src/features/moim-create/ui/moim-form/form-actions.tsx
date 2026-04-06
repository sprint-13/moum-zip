"use client";

import { Button } from "@ui/components";
import { FieldError } from "@/features/moim-create/ui/moim-form/form-field-error";

type MoimFormState = { ok: false; error?: string };
type MoimFormActionsProps = {
  state: MoimFormState | null;
  isPending: boolean;
  submitLabel: string;
  onCancel: () => void;
};

export const FormActions = ({ state, isPending, submitLabel, onCancel }: MoimFormActionsProps) => {
  return (
    <>
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
    </>
  );
};
