"use client";

import { cn } from "@ui/lib/utils";
import { cva } from "class-variance-authority";
import { useEffect } from "react";

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

// ButtonHTMLAttributes 확장
interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
  active?: boolean;
  // cloneElement → Render Props 방식으로 변경
  icon: (size: number) => React.ReactNode;
}

const iconSizeMap = { sm: 20, md: 24, lg: 32 };

// GradientDefs를 버튼마다 렌더링하지 않고 useEffect로 DOM에 한 번만 추가
const useGradientDefs = () => {
  useEffect(() => {
    if (document.getElementById("icon-gradient")) return;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.position = "absolute";
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = `
      <defs>
        <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="var(--gradient-500-start)" />
          <stop offset="100%" stop-color="var(--gradient-500-end)" />
        </linearGradient>
      </defs>
    `;
    document.body.appendChild(svg);
  }, []);
};

export function UtilityButton({
  size = "md",
  active,
  icon,
  "aria-label": ariaLabel, // aria-label 접근성 추가
  className,
  ...props
}: Props) {
  useGradientDefs();

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={cn(utilityButtonVariants({ size, active }), className)}
      {...props}
    >
      {icon(iconSizeMap[size])}
    </button>
  );
}
