import { type MoimCreateFormValues, moimCreateSchema } from "@/entities/moim/model/schema";
import { ERROR_CODES, ValidationError } from "@/shared/lib/error";

export const parseMoimFormData = (formData: FormData): MoimCreateFormValues => {
  const raw = {
    type: formData.get("type"),
    name: formData.get("name"),
    capacity: Number(formData.get("capacity")),
    description: formData.get("description"),
    image: formData.get("image"),
    location: formData.get("location"),
    date: formData.get("date"),
    time: formData.get("time"),
    deadlineDate: formData.get("deadlineDate"),
    deadlineTime: formData.get("deadlineTime"),
    themeColor: formData.get("themeColor"),
    options: formData.getAll("options"),
  };

  const parsed = moimCreateSchema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError(ERROR_CODES.VALIDATION_ERROR, {
      message: parsed.error.issues[0]?.message ?? "입력값이 올바르지 않습니다.",
    });
  }

  return parsed.data;
};
