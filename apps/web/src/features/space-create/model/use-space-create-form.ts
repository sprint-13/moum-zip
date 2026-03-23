import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type SpaceCreateFormInput, type SpaceCreateFormValues, spaceCreateSchema } from "./schema";

export const useSpaceCreateForm = () => {
  const form = useForm<SpaceCreateFormInput, unknown, SpaceCreateFormValues>({
    resolver: zodResolver(spaceCreateSchema),
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

  const onSubmit = (_data: SpaceCreateFormValues) => {
    // TODO: API 연결
  };

  return { form, onSubmit };
};
