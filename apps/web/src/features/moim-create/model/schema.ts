import { z } from "zod";

// TODO: 스페이스 기능 선택 방식 확정 후 값 추가 예정
const spaceFunctionSchema = z.enum(["bulletin", "schedule", "members"]);
export type SpaceFunction = z.infer<typeof spaceFunctionSchema>;

export const moimCreateSchema = z.object({
  type: z.enum(["study", "project"], { error: "모임 종류를 선택해주세요." }),
  name: z.string().min(1, "모임 이름을 입력해주세요."),
  capacity: z.number({ error: "모집 정원을 입력해주세요." }).min(1, "1명 이상 입력해주세요."),
  description: z.string().min(1, "모임 설명을 입력해주세요."),
  image: z.string().min(1, "이미지를 첨부해주세요."),
  location: z.enum(["online", "offline"], { error: "장소를 선택해주세요." }),
  date: z.string().min(1, "모임 날짜를 선택해주세요."),
  time: z.string().min(1, "모임 시간을 선택해주세요."),
  deadlineDate: z.string().min(1, "마감 날짜를 선택해주세요."),
  deadlineTime: z.string().min(1, "마감 시간을 선택해주세요."),
  themeColor: z.string().min(1, "테마 색상을 선택해주세요."),
  options: spaceFunctionSchema.array().optional(),
});

// moimCreateSchema 기반 타입 자동 추출 - schema와 type을 단일 소스로 관리
export type MoimCreateFormValues = z.infer<typeof moimCreateSchema>;
