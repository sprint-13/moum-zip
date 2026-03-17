"use client";
import { cn } from "@ui/lib/utils";
import type { ComponentProps } from "react";
import { useId } from "react";

interface InputTextAreaProps extends Omit<ComponentProps<"textarea">, "id"> {
  label: string;
  id?: string;
  message?: string;
  isDestructive?: boolean;
  required?: boolean;
}

const InputTextArea = ({
  className,
  disabled,
  id,
  isDestructive = false,
  label,
  message,
  required = false,
  ...props
}: InputTextAreaProps) => {
  // textarea와 안내 문구를 접근성 속성으로 연결합니다.
  const generatedId = useId();
  const textAreaId = id ?? generatedId;
  const messageId = message ? `${textAreaId}-message` : undefined;

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={textAreaId} className="font-semibold text-foreground text-sm leading-[1.2]">
        {label}
        {required ? <span className="ml-1 text-primary">*</span> : null}
      </label>
      <textarea
        id={textAreaId}
        aria-describedby={messageId}
        aria-invalid={isDestructive || undefined}
        disabled={disabled}
        className={cn(
          "min-h-[120px] w-full max-w-[456px] resize-none rounded-[16px] border border-input bg-background px-4 py-4 font-medium text-base text-foreground leading-[1.2] outline-none placeholder:text-muted-foreground focus:border-ring disabled:opacity-60 max-md:max-w-[311px]",
          isDestructive ? "border-destructive focus:border-destructive" : "",
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

export { InputTextArea };
export type { InputTextAreaProps };
