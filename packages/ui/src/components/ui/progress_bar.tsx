import { cn } from "@ui/lib/utils";
import type { ComponentPropsWithoutRef, CSSProperties } from "react";

interface ProgressBarProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  maxValue: number;
  value: number;
  width?: CSSProperties["width"];
}

const clampProgressValue = (value: number, maxValue: number) => {
  if (maxValue <= 0) {
    return 0;
  }

  return Math.min(Math.max(value, 0), maxValue);
};

const ProgressPersonIcon = ({ className }: ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg
      aria-hidden="true"
      className={cn("size-4 shrink-0 text-muted-foreground/50", className)}
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8.00016" cy="5.33329" r="2.66667" fill="currentColor" />
      <path
        d="M3.55875 11.547C3.99947 9.68453 5.84798 8.66663 7.76188 8.66663H8.23844C10.1523 8.66663 12.0009 9.68453 12.4416 11.547C12.5268 11.9074 12.5946 12.2845 12.6328 12.6677C12.6692 13.0341 12.3684 13.3333 12.0002 13.3333H4.00016C3.63197 13.3333 3.33111 13.0341 3.36757 12.6677C3.4057 12.2845 3.47348 11.9074 3.55875 11.547Z"
        fill="currentColor"
      />
    </svg>
  );
};

const ProgressBar = ({ className, maxValue, style, value, width, ...props }: ProgressBarProps) => {
  const resolvedMaxValue = Math.max(maxValue, 0);
  const resolvedValue = clampProgressValue(value, resolvedMaxValue);
  const progressPercent = resolvedMaxValue > 0 ? (resolvedValue / resolvedMaxValue) * 100 : 0;
  const progressBarStyle = width === undefined ? style : { ...style, width };

  // value가 한자릿수일 경우, value의 width가 줄어들며 progressbar의 width가 늘어나는 경우가 발생해 고정width를 정해줌
  const maxValueDigits = String(resolvedMaxValue).length;
  const valueLabelWidth = `${maxValueDigits * 2 + 1}ch`;

  return (
    <div
      aria-valuemax={resolvedMaxValue}
      aria-valuemin={0}
      aria-valuenow={resolvedValue}
      aria-valuetext={`${resolvedValue}/${resolvedMaxValue}`}
      className={cn("flex min-w-32 w-full items-center gap-2", className)}
      role="progressbar"
      style={progressBarStyle}
      {...props}
    >
      <div className="flex min-w-0 flex-1 items-center gap-1.25">
        <ProgressPersonIcon />
        <div className="h-1.25 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-background-gradient" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
      <p
        className="shrink-0 text-right text-sm leading-5 font-medium tabular-nums whitespace-nowrap text-muted-foreground"
        style={{ width: valueLabelWidth }}
      >
        <span className="font-semibold tracking-[-0.03em] text-primary">{resolvedValue}</span>
        <span>/{resolvedMaxValue}</span>
      </p>
    </div>
  );
};

export { ProgressBar };
export type { ProgressBarProps };
