import { Button as ShadcnButton } from "@ui/components/shadcn/button";
import { cn } from "@ui/lib/utils";
import { cva } from "class-variance-authority";
import { Plus } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

const createButtonVariants = cva(
  "flex items-center justify-center bg-primary text-white transition-colors hover:bg-green-600",
  {
    variants: {
      variant: {
        full: "h-16 min-w-[188px] gap-2 rounded-[24px] px-6 font-bold text-xl",
        icon: "h-12 w-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "full",
    },
  },
);

interface CreateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "full" | "icon";
  children?: ReactNode;
  asChild?: boolean;
}

export function CreateButton({ variant = "full", children, className, asChild, type, ...props }: CreateButtonProps) {
  return (
    <ShadcnButton
      variant="default"
      asChild={asChild}
      type={asChild ? undefined : (type ?? "button")} // asChild가 아닐 때만 기본 type을 button으로 설정정
      className={cn(createButtonVariants({ variant }), className)}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          <Plus className="size-8" aria-hidden="true" />
          {children}
        </>
      )}
    </ShadcnButton>
  );
}
