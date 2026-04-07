import { cn } from "@/shared/lib/cn";

type FieldErrorProps = {
  message?: string;
  className?: string;
};

export const FieldError = ({ message, className }: FieldErrorProps) => {
  if (!message) return null;

  return (
    <p role="alert" aria-live="polite" className={cn("font-medium text-destructive text-sm leading-[1.2]", className)}>
      {message}
    </p>
  );
};
