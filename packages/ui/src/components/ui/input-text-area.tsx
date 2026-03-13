import { cn } from "@ui/lib/utils";
import * as React from "react";

interface InputTextAreaProps extends Omit<React.ComponentProps<"textarea">, "id"> {
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
  const generatedId = React.useId();
  const textAreaId = id ?? generatedId;
  const messageId = message ? `${textAreaId}-message` : undefined;

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={textAreaId} className="text-[14px] leading-[1.2] font-semibold text-[#333333]">
        {label}
        {required ? <span className="ml-1 text-[#00BB86]">*</span> : null}
      </label>
      <textarea
        id={textAreaId}
        aria-describedby={messageId}
        aria-invalid={isDestructive || undefined}
        disabled={disabled}
        className={cn(
          "min-h-[120px] w-[456px] resize-none rounded-[16px] border border-transparent bg-[#F3F4F6] px-4 py-4 text-[16px] leading-[1.2] font-medium text-[#333333] outline-none placeholder:text-[#A4A4A4] focus:border-[#00BB86] disabled:opacity-60 max-md:w-[311px]",
          isDestructive ? "border-[#E91616] focus:border-[#E91616]" : "",
          className,
        )}
        {...props}
      />
      {message ? (
        <p
          id={messageId}
          className={cn("text-[14px] leading-[1.2] font-medium", isDestructive ? "text-[#E91616]" : "text-[#A4A4A4]")}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
};

export { InputTextArea };
export type { InputTextAreaProps };
