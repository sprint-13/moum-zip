import { cn } from "@/shared/lib/cn";

type FieldErrorProps = {
  message?: string;
  className?: string;
};

export const FieldError = ({ message, className }: FieldErrorProps) => {
  const hasMessage = Boolean(message);

  return (
    <p
      role={hasMessage ? "alert" : undefined}
      aria-live={hasMessage ? "polite" : undefined}
      className={cn(
        "min-h-[18px] font-medium text-destructive text-sm leading-[1.2]",
        !hasMessage && "invisible",
        className,
      )}
    >
      {message ?? "\u00A0"}
    </p>
  );
};
