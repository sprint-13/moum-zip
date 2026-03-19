"use client";
import { Eye, EyeOff } from "@moum-zip/ui/icons";
import { Button, InputField, SocialButton } from "@ui/components";
import { cn } from "@ui/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface LoginFormValues {
  email: string;
  password: string;
}

export const LoginForm = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: "onSubmit",
  });

  const handlePasswordToggle = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const onSubmit = (data: LoginFormValues) => {
    // TODO: 로그인 API 연결
  };

  return (
    <div className="flex w-full flex-col">
      <h1 className="text-center font-semibold text-base text-foreground md:text-2xl">로그인</h1>
      <form className="flex flex-col gap-6 pt-10" onSubmit={handleSubmit(onSubmit)}>
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
        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-semibold text-foreground text-sm leading-[1.2]">
            비밀번호 <span className="ml-1 text-primary">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={isPasswordVisible ? "text" : "password"}
              placeholder="비밀번호를 입력해주세요"
              className={cn(
                "min-h-12 w-full max-w-[456px] rounded-md border bg-input-background px-3 font-normal text-foreground text-sm placeholder:text-slate-500 focus-visible:outline-none max-md:max-w-[311px] md:text-base [&::-ms-reveal]:hidden",
                errors.password ? "border-destructive" : "border-input focus-visible:border-ring",
              )}
              {...register("password", {
                required: "비밀번호를 입력해주세요.",
                minLength: {
                  value: 8,
                  message: "8자 이상 입력해주세요.",
                },
              })}
            />
            <button
              type="button"
              onClick={handlePasswordToggle}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
            >
              {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="font-medium text-destructive text-sm leading-[1.2]">{errors.password.message}</p>
          )}
        </div>
        <Button
          variant="tertiary"
          type="submit"
          className="mt-2 bg-slate-100 text-base text-muted-foreground hover:bg-slate-200 md:text-xl"
        >
          로그인
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
