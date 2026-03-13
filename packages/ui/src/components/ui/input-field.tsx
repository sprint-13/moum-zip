import { cn } from "@ui/lib/utils";
import * as React from "react";

import { Input } from "../shadcn/input";

interface InputFieldProps extends Omit<React.ComponentProps<typeof Input>, "id"> {
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
  const generatedId = React.useId();
  const inputId = id ?? generatedId;
  const messageId = message ? `${inputId}-message` : undefined;

  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={inputId} className="text-[14px] leading-[1.2] font-semibold text-[#333333]">
        {label}
        {required ? <span className="ml-1 text-[#00BB86]">*</span> : null}
      </label>
      <Input
        id={inputId}
        aria-describedby={messageId}
        aria-invalid={isDestructive || undefined}
        disabled={disabled}
        className={cn(
          "h-[48px] w-[456px] border border-transparent bg-[#F3F4F6]  text-[16px] leading-[1.2] font-medium text-[#333333] shadow-none placeholder:text-[#A4A4A4] focus-visible:ring-0 focus-visible:ring-offset-0 disabled:opacity-60",
          isDestructive ? "border-[#E91616] focus-visible:border-[#E91616]" : "focus-visible:border-[#00BB86]",
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

export { InputField };
export type { InputFieldProps };
