import { z } from "zod";

// TODO: 스페이스 기능 선택 방식 확정 후 값 추가 예정
const spaceFunctionSchema = z.enum(["bulletin", "schedule", "members"]);
export type SpaceFunction = z.infer<typeof spaceFunctionSchema>;

// utils
const toDateTime = (date: string, time: string) => new Date(`${date}T${time}`);
const isValidDate = (date: Date) => !Number.isNaN(date.getTime());

// time field schema
// 피커에서 "12:" / ":30" 같은 중간 입력 상태도 들어올 수 있어서 케이스별로 분기 처리
const timeFieldSchema = (requiredMessage: string) => {
  return z
    .string()
    .min(1, requiredMessage)
    .superRefine((value, ctx) => {
      const isFullTime = /^\d{2}:\d{2}$/.test(value); // ex. 12:30
      const isHourOnly = /^\d{2}:$/.test(value); // ex. 12:
      const isMinuteOnly = /^:\d{2}$/.test(value); // ex. :30

      if (isFullTime) {
        const h = Number(value.slice(0, 2));
        const m = Number(value.slice(3, 5));

        // 시간 범위 검증 (24h 기준)
        if (h > 23 || m > 59) {
          ctx.addIssue({ code: "custom", message: "올바른 시간을 선택해주세요." });
        }
        return;
      }

      // 시간만 선택된 경우
      if (isHourOnly) {
        ctx.addIssue({ code: "custom", message: "분을 선택해주세요." });
        return;
      }

      // 분만 선택된 경우
      if (isMinuteOnly) {
        ctx.addIssue({ code: "custom", message: "시를 선택해주세요." });
        return;
      }

      // 둘 다 선택 안 된 경우
      ctx.addIssue({ code: "custom", message: "시와 분을 모두 선택해주세요." });
    });
};

// main schema
export const moimCreateSchema = z
  .object({
    type: z.enum(["study", "project"], { error: "모임 종류를 선택해주세요." }),
    name: z.string().min(1, "모임 이름을 입력해주세요."),
    capacity: z
      .number({ error: "모집 정원을 입력해주세요." })
      .min(1, "1명 이상 입력해주세요.")
      .max(1000, "최대 1000명까지 가능합니다."),
    description: z.string().min(1, "모임 설명을 입력해주세요."),
    image: z.string().min(1, "이미지를 첨부해주세요."),
    location: z.enum(["online", "offline"], { error: "장소를 선택해주세요." }),
    date: z.string().min(1, "모임 날짜를 선택해주세요."),
    time: timeFieldSchema("모임 시간을 선택해주세요."),
    deadlineDate: z.string().min(1, "마감 날짜를 선택해주세요."),
    deadlineTime: timeFieldSchema("마감 시간을 선택해주세요."),
    themeColor: z.string().min(1, "테마 색상을 선택해주세요."),
    options: spaceFunctionSchema.array().optional(),
  })
  .superRefine((data, ctx) => {
    const now = new Date();
    const moimDateTime = toDateTime(data.date, data.time);
    const deadlineDateTime = toDateTime(data.deadlineDate, data.deadlineTime);

    // 모임 시간 검증
    if (isValidDate(moimDateTime) && moimDateTime <= now) {
      ctx.addIssue({ code: "custom", message: "모임 일시는 현재 시각 이후여야 합니다.", path: ["date"] });
    }

    // 마감 시간 검증
    if (isValidDate(deadlineDateTime) && deadlineDateTime <= now) {
      ctx.addIssue({ code: "custom", message: "모집 마감 일시는 현재 시각 이후여야 합니다.", path: ["deadlineDate"] });
    }

    // 마감 < 모임 검증
    if (isValidDate(moimDateTime) && isValidDate(deadlineDateTime) && deadlineDateTime >= moimDateTime) {
      const message = "모집 마감 일시는 모임 일시 이전이어야 합니다.";
      ctx.addIssue({ code: "custom", message, path: ["deadlineDate"] });
      ctx.addIssue({ code: "custom", message, path: ["deadlineTime"] });
    }
  });

// moimCreateSchema 기반 타입 자동 추출 - schema와 type을 단일 소스로 관리
export type MoimCreateFormValues = z.infer<typeof moimCreateSchema>;
