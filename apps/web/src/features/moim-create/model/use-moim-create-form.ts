import { zodResolver } from "@hookform/resolvers/zod";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { createMoimAction } from "@/_pages/moim-create/actions";
import { type MoimCreateFormValues, moimCreateSchema } from "@/features/moim-create/model/schema";

const MOIM_CREATE_DEFAULT_VALUES: Partial<MoimCreateFormValues> = {
  type: "study",
  name: "",
  capacity: undefined,
  description: "",
  image: "",
  location: "online",
  date: "",
  time: "",
  deadlineDate: "",
  deadlineTime: "",
  themeColor: "primary",
};

// FormData 변환 (useActionState의 formAction은 FormData만 받음)
const objectToFormData = (data: MoimCreateFormValues): FormData => {
  const formData = new FormData();
  for (const [key, value] of Object.entries(data)) {
    formData.append(key, String(value ?? ""));
  }
  return formData;
};

export const useMoimCreateForm = () => {
  const [state, formAction, isPending] = useActionState(createMoimAction, null);

  const form = useForm<MoimCreateFormValues>({
    resolver: zodResolver(moimCreateSchema),
    defaultValues: MOIM_CREATE_DEFAULT_VALUES,
    mode: "onSubmit",
  });

  // rhf 검증 통과 후 → FormData 변환 → 서버 액션 호출
  const onSubmit = form.handleSubmit((data) => {
    startTransition(() => {
      formAction(objectToFormData(data));
    });
  });

  return { form, onSubmit, state, isPending };
};
