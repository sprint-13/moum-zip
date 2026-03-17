import { cn } from "@ui/lib/utils";
import { cva } from "class-variance-authority";
import { Plus } from "lucide-react";

const createButtonVariants = cva(
  "flex items-center justify-center text-white bg-primary hover:bg-green-600 transition-colors",
  {
    variants: {
      variant: {
        full: "min-w-[188px] h-16 rounded-[24px] gap-2 font-bold text-xl px-6",
        icon: "w-12 h-12 rounded-full",
      },
    },
    defaultVariants: {
      variant: "full",
    },
  },
);

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "full" | "icon";
  children?: React.ReactNode;
}

export function CreateButton({ variant = "full", children, className, ...props }: Props) {
  return (
    <button type="button" className={cn(createButtonVariants({ variant }), className)} {...props}>
      <Plus size={32} />
      {children}
    </button>
  );
}
