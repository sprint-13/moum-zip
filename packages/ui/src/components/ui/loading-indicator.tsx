"use client";

import { cn } from "@ui/lib/utils";

interface LoadingIndicatorProps {
  text?: string;
  description?: string;
  fullScreen?: boolean;
  className?: string;
}

export function LoadingIndicator({ text = "불러오는 중", fullScreen = false, className }: LoadingIndicatorProps) {
  return (
    <div className={cn("flex items-center justify-center px-5", fullScreen && "min-h-screen", className)}>
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <p className="font-semibold text-base text-gray-900">{text}</p>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 animate-[soft-bounce_1s_ease-in-out_infinite] rounded-full bg-primary" />
            <span className="h-2 w-2 animate-[soft-bounce_1s_ease-in-out_infinite_0.15s] rounded-full bg-primary/80" />
            <span className="h-2 w-2 animate-[soft-bounce_1s_ease-in-out_infinite_0.3s] rounded-full bg-primary/60" />
          </div>
        </div>
      </div>
    </div>
  );
}
