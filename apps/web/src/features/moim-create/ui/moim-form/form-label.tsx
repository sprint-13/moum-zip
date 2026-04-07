import { cn } from "@/shared/lib/cn";

type FormLabelProps = {
  label: string;
  required?: boolean;
  className?: string;
};

export const FormLabel = ({ label, required, className }: FormLabelProps) => {
  return (
    <p className={cn("font-semibold text-foreground text-sm leading-[1.2]", className)}>
      {label}
      {required ? <span className="pl-1 text-primary">*</span> : null}
    </p>
  );
};
