"use client";

import { Button, InputField, SocialButton } from "@ui/components";
import Link from "next/link";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { loginAction } from "@/_pages/auth/actions";
import { PasswordInput } from "./password-input";

interface LoginFormValues {
  email: string;
  password: string;
}

// 에러 메시지 한국어 변환
const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: "이메일 또는 비밀번호가 올바르지 않아요.",
  INVALID_TOKEN: "인증 중 오류가 발생했어요. 다시 시도해주세요.",
  SERVER_ERROR: "서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.",
} as const;

export const LoginForm = () => {
  // 서버 액션 상태 관리
  const [state, formAction, isPending] = useActionState(loginAction, null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: "onSubmit",
  });

  // react-hook-form 유효성 검사 통과 후 → 서버 액션 호출
  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <div className="flex w-full flex-col">
      <h1 className="text-center font-semibold text-base text-foreground md:text-2xl">로그인</h1>
      <form className="flex flex-col gap-6 pt-10" onSubmit={onSubmit}>
        <InputField
          label="아이디"
          placeholder="이메일을 입력해주세요"
          required
          className="bg-input-background font-normal text-sm shadow-none placeholder:text-slate-500 aria-invalid:shadow-none aria-invalid:ring-0 md:text-base"
          isDestructive={!!errors.email}
          message={errors.email?.message}
          {...register("email", {
            required: "이메일을 입력해주세요.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "이메일 형식이 아닙니다.",
            },
          })}
        />
        <PasswordInput
          id="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해주세요"
          registration={register("password", {
            required: "비밀번호를 입력해주세요.",
            minLength: { value: 8, message: "8자 이상 입력해주세요." },
          })}
          error={errors.password}
        />

        {/* 서버에서 온 에러 메시지 표시 */}
        {state && !state.ok && <p className="text-red-500 text-sm">{ERROR_MESSAGES[state.error]}</p>}

        <Button
          variant="tertiary"
          type="submit"
          disabled={isPending}
          className="mt-2 bg-slate-100 text-base text-muted-foreground hover:bg-slate-200 md:text-xl"
        >
          {isPending ? "로그인 중..." : "로그인"}
        </Button>
      </form>
      <div className="relative my-8 flex items-center gap-3">
        <div className="flex-1 border-border border-t" />
        <span className="text-muted-foreground text-sm">SNS 계정으로 로그인</span>
        <div className="flex-1 border-border border-t" />
      </div>
      <div className="flex flex-col items-center gap-3 md:flex-row md:justify-center">
        <SocialButton provider="google" className="w-full md:w-[222px]" />
        <SocialButton provider="kakao" className="w-full md:w-[222px]" />
      </div>
      <p className="mt-8 text-center text-foreground text-sm md:text-[15px]">
        모음.zip이 처음이신가요?{" "}
        <Link href="/signup" className="font-semibold text-green-600 underline">
          회원가입
        </Link>
      </p>
    </div>
  );
};
