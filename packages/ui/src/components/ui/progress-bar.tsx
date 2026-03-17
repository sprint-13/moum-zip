import { cn } from "@ui/lib/utils";
import type { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";

interface ProgressBarProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {
  maxValue: number;
  value: number;
  width?: CSSProperties["width"];
}

interface LabeledProgressBarProps extends Pick<ProgressBarProps, "maxValue" | "value" | "width"> {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  className?: string;
  icon?: ReactNode;
  style?: CSSProperties;
}

const clampProgressValue = (value: number, maxValue: number) => {
  if (maxValue <= 0) {
    return 0;
  }

  return Math.min(Math.max(value, 0), maxValue);
};

const getProgressMetrics = (value: number, maxValue: number) => {
  const resolvedMaxValue = Math.max(maxValue, 0);
  const resolvedValue = clampProgressValue(value, resolvedMaxValue);
  const progressPercent = resolvedMaxValue > 0 ? (resolvedValue / resolvedMaxValue) * 100 : 0;

  return {
    progressPercent,
    resolvedMaxValue,
    resolvedValue,
  };
};

const getValueLabelWidth = (maxValue: number) => {
  const maxValueDigits = String(Math.max(maxValue, 0)).length;

  return `${maxValueDigits * 2 + 1}ch`;
};

const getWidthStyle = (style: CSSProperties | undefined, width: CSSProperties["width"]) => {
  if (width === undefined) {
    return style;
  }

  return {
    ...style,
    width,
  };
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
  const { progressPercent, resolvedMaxValue, resolvedValue } = getProgressMetrics(value, maxValue);
  const progressBarStyle = getWidthStyle(style, width);

  return (
    <div
      aria-valuemax={resolvedMaxValue}
      aria-valuemin={0}
      aria-valuenow={resolvedValue}
      aria-valuetext={`${resolvedValue}/${resolvedMaxValue}`}
      className={cn("flex w-full min-w-32 items-center", className)}
      role="progressbar"
      style={progressBarStyle}
      {...props}
    >
      <div className="h-1.25 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-background-gradient" style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  );
};

const LabeledProgressBar = ({
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledby,
  className,
  icon = <ProgressPersonIcon />,
  maxValue,
  style,
  value,
  width,
}: LabeledProgressBarProps) => {
  const { resolvedMaxValue, resolvedValue } = getProgressMetrics(value, maxValue);
  const valueLabelWidth = getValueLabelWidth(resolvedMaxValue);
  const isTrackWidthControlled = width !== undefined;

  return (
    <div className={cn("flex items-center gap-2", !isTrackWidthControlled && "w-full", className)} style={style}>
      <div className={cn("flex min-w-0 items-center gap-1.25", !isTrackWidthControlled && "flex-1")}>
        {icon}
        <ProgressBar
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          className={cn("min-w-0", !isTrackWidthControlled && "flex-1")}
          maxValue={resolvedMaxValue}
          value={resolvedValue}
          width={width}
        />
      </div>
      <p
        className="shrink-0 whitespace-nowrap text-right font-medium text-muted-foreground text-sm tabular-nums leading-5"
        style={{ width: valueLabelWidth }}
      >
        <span className="font-semibold text-primary tracking-[-0.03em]">{resolvedValue}</span>
        <span>/{resolvedMaxValue}</span>
      </p>
    </div>
  );
};

export { LabeledProgressBar, ProgressBar };
export type { LabeledProgressBarProps, ProgressBarProps };
