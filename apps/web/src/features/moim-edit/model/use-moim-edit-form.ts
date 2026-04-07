import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { updateMoimAction } from "@/_pages/moim-edit/actions";
import { type MoimCreateFormValues, moimCreateSchema } from "@/entities/moim";

interface UseMoimEditFormParams {
  meetingId: number;
  initialValues: MoimCreateFormValues;
}

const objectToFormData = (meetingId: number, data: MoimCreateFormValues): FormData => {
  const formData = new FormData();

  formData.append("meetingId", String(meetingId));

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        formData.append(key, String(item));
      }
    } else {
      formData.append(key, String(value ?? ""));
    }
  }

  return formData;
};

export const useMoimEditForm = ({ meetingId, initialValues }: UseMoimEditFormParams) => {
  const [state, formAction, isPending] = useActionState(updateMoimAction, null);

  const form = useForm<MoimCreateFormValues>({
    resolver: zodResolver(moimCreateSchema),
    defaultValues: initialValues,
    mode: "onSubmit",
  });

  const { reset } = form;

  useEffect(() => {
    reset(initialValues);
  }, [initialValues, reset]);

  const onSubmit = form.handleSubmit((data) => {
    startTransition(() => {
      formAction(objectToFormData(meetingId, data));
    });
  });

  return { form, onSubmit, state, isPending };
};
