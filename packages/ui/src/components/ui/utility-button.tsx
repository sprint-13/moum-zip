import { cn } from "@ui/lib/utils";
import { cva } from "class-variance-authority";
import { cloneElement } from "react";

const utilityButtonVariants = cva("rounded-full flex items-center justify-center border border-slate-200 bg-white/90", {
  variants: {
    size: {
      sm: "w-10 h-10",
      md: "w-12 h-12",
      lg: "w-[60px] h-[60px]",
    },
    active: {
      true: "",
      false: "text-slate-400",
    },
  },
  defaultVariants: {
    size: "md",
    active: false,
  },
});

interface Props {
  size?: "sm" | "md" | "lg";
  active?: boolean;
  icon: React.ReactElement<{ size?: number; fill?: string; stroke?: string }>;
}

const GradientDefs = () => (
  <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
    <defs>
      <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="var(--gradient-500-start)" />
        <stop offset="100%" stopColor="var(--gradient-500-end)" />
      </linearGradient>
    </defs>
  </svg>
);

const iconSizeMap = { sm: 20, md: 24, lg: 32 };

export function UtilityButton({ size = "md", active, icon }: Props) {
  const styledIcon = cloneElement(icon, {
    size: iconSizeMap[size],
    ...(active && {
      fill: "url(#icon-gradient)",
      stroke: "url(#icon-gradient)",
    }),
  });

  return (
    <>
      <GradientDefs />
      <button type="button" className={cn(utilityButtonVariants({ size, active }))}>
        {styledIcon}
      </button>
    </>
  );
}
