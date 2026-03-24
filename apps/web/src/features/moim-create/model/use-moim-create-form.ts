import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type MoimCreateFormValues, moimCreateSchema } from "@/features/moim-create/model/schema";

export const useMoimCreateForm = () => {
  const form = useForm<MoimCreateFormValues>({
    resolver: zodResolver(moimCreateSchema),
    defaultValues: {
      type: undefined,
      name: "",
      capacity: undefined,
      description: "",
      image: "",
      location: undefined,
      date: "",
      time: "",
      deadlineDate: "",
      deadlineTime: "",
      themeColor: "",
    },
  });

  const onSubmit = (_data: MoimCreateFormValues) => {
    // TODO: API 연결
  };

  return { form, onSubmit };
};
