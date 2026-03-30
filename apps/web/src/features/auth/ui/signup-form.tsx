"use client";
import { Button, InputField, SocialButton } from "@moum-zip/ui/components";
import Link from "next/link";
import { startTransition, useActionState } from "react";
import { useForm } from "react-hook-form";
import { signupAction } from "@/_pages/auth/actions";
import { getGoogleLoginUrl, getKakaoLoginUrl } from "@/_pages/auth/use-cases/social-login-url";
import { ROUTES } from "@/shared/config/routes";
import { PasswordInput } from "./password-input";

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

// 에러 메시지 한국어 변환
const ERROR_MESSAGES = {
  EMAIL_ALREADY_EXISTS: "이미 사용 중인 이메일이에요.",
  SERVER_ERROR: "서버에 연결할 수 없어요. 잠시 후 다시 시도해주세요.",
} as const;

export const SignupForm = () => {
  // 서버 액션 상태 관리
  const [state, formAction, isPending] = useActionState(signupAction, null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<SignupFormValues>({
    mode: "onSubmit",
  });

  // react-hook-form 유효성 검사 통과 후 → 서버 액션 호출
  const onSubmit = handleSubmit((data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    startTransition(() => {
      formAction(formData);
    });
  });

  return (
    <div className="flex w-full flex-col">
      <h1 className="text-center font-semibold text-base text-foreground md:text-2xl">회원가입</h1>
      <form className="flex flex-col gap-6 pt-10" onSubmit={onSubmit}>
        <InputField
          label="이름"
          placeholder="이름을 입력해주세요"
          required
          className="bg-input-background font-normal text-sm shadow-none placeholder:text-slate-500 aria-invalid:shadow-none aria-invalid:ring-0 md:text-base"
          isDestructive={!!errors.name}
          message={errors.name?.message}
          {...register("name", {
            required: "이름은 필수 입력 항목입니다.",
          })}
        />
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
        <PasswordInput
          id="passwordConfirm"
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력해주세요"
          registration={register("passwordConfirm", {
            required: "비밀번호 확인을 입력해주세요.",
            validate: (value: string) => value === getValues("password") || "비밀번호가 일치하지 않습니다.",
          })}
          error={errors.passwordConfirm}
        />

        {/* 서버에서 온 에러 메시지 표시 */}
        {state && !state.ok && <p className="text-red-500 text-sm">{ERROR_MESSAGES[state.error]}</p>}

        <Button
          variant="tertiary"
          type="submit"
          disabled={isPending}
          className="mt-2 bg-slate-100 text-base text-muted-foreground hover:bg-slate-200 md:text-xl"
        >
          {isPending ? "가입 중..." : "회원가입"}
        </Button>
      </form>
      <div className="relative my-8 flex items-center gap-3">
        <div className="flex-1 border-border border-t" />
        <span className="text-muted-foreground text-sm">SNS 계정으로 회원가입</span>
        <div className="flex-1 border-border border-t" />
      </div>
      <div className="flex flex-col items-center gap-3 md:flex-row md:justify-center">
        <SocialButton
          provider="google"
          className="w-full md:w-[222px]"
          onClick={() => {
            window.location.href = getGoogleLoginUrl();
          }}
        />
        <SocialButton
          provider="kakao"
          className="w-full md:w-[222px]"
          onClick={() => {
            window.location.href = getKakaoLoginUrl();
          }}
        />
      </div>
      <p className="mt-8 text-center text-foreground text-sm md:text-[15px]">
        이미 회원이신가요?{" "}
        <Link href={ROUTES.login} className="font-semibold text-green-600 underline">
          로그인
        </Link>
      </p>
    </div>
  );
};
