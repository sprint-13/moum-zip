"use client";
import { Input } from "@ui/components/shadcn/input";
import { cn } from "@ui/lib/utils";
import type { ComponentProps } from "react";
import { useId } from "react";

interface InputFieldProps extends Omit<ComponentProps<typeof Input>, "id"> {
  label: string;
  id?: string;
  message?: string;
  isDestructive?: boolean;
  required?: boolean;
}

const InputField = ({
  className,
  disabled,
  id,
  isDestructive = false,
  label,
  message,
  required = false,
  ...props
}: InputFieldProps) => {
  // 입력 요소와 안내 문구를 접근성 속성으로 연결합니다.
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const messageId = message ? `${inputId}-message` : undefined;

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={inputId} className="font-semibold text-foreground text-sm leading-[1.2]">
        {label}
        {required ? <span className="ml-1 text-primary">*</span> : null}
      </label>
      <Input
        id={inputId}
        aria-describedby={messageId}
        aria-invalid={isDestructive || undefined}
        disabled={disabled}
        className={cn(
          "min-h-12 w-full max-w-[456px] border border-input bg-background font-medium text-base text-foreground leading-[1.2] shadow-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60 max-md:max-w-[311px]",
          isDestructive ? "border-destructive focus-visible:border-destructive" : "focus-visible:border-ring",
          className,
        )}
        {...props}
      />
      {message ? (
        <p
          id={messageId}
          className={cn(
            "font-medium text-sm leading-[1.2]",
            isDestructive ? "text-destructive" : "text-muted-foreground",
          )}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
};

export { InputField };
export type { InputFieldProps };
