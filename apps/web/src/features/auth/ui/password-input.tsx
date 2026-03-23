"use client";
import { Eye, EyeOff } from "@moum-zip/ui/icons";
import { cn } from "@ui/lib/utils";
import { useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface PasswordInputProps {
  id: string;
  label: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: FieldError;
}

export const PasswordInput = ({ id, label, placeholder, registration, error }: PasswordInputProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-semibold text-foreground text-sm leading-[1.2]">
        {label} <span className="ml-1 text-primary">*</span>
      </label>
      <div className="relative">
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(
            "min-h-12 w-full max-w-[456px] rounded-md border bg-input-background px-3 font-normal text-foreground text-sm placeholder:text-slate-500 focus-visible:outline-none max-md:max-w-[311px] md:text-base [&::-ms-reveal]:hidden",
            error ? "border-destructive" : "border-input focus-visible:border-ring",
          )}
          {...registration}
        />
        <button
          type="button"
          onClick={() => setIsVisible((prev) => !prev)}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
          aria-label={isVisible ? "비밀번호 숨기기" : "비밀번호 표시"}
          aria-pressed={isVisible}
        >
          {isVisible ? <EyeOff size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="font-medium text-destructive text-sm leading-[1.2]">
          {error.message}
        </p>
      )}
    </div>
  );
};
