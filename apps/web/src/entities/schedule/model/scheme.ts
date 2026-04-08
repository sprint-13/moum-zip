import { z } from "zod";

export const scheduleSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  description: z.string().optional(),
  date: z.string().min(1, "날짜를 선택해주세요."),
  time: z.string().min(1, "시간을 선택해주세요."),
});
