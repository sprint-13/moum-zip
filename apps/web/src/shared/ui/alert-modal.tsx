"use client";

import * as Shadcn from "@moum-zip/ui/components";
import { X } from "@moum-zip/ui/icons";
import { cn } from "@ui/lib/utils";
import type { ComponentProps, ReactElement, ReactNode } from "react";

type AlertModalProps = ComponentProps<typeof Shadcn.AlertDialog>;

const AlertModalBase = ({ children, ...props }: AlertModalProps) => {
  return <Shadcn.AlertDialog {...props}>{children}</Shadcn.AlertDialog>;
};

interface AlertModalTriggerProps extends Omit<ComponentProps<typeof Shadcn.AlertDialogTrigger>, "children"> {
  children: ReactElement;
}

const AlertModalTrigger = ({ children, ...props }: AlertModalTriggerProps) => {
  return (
    <Shadcn.AlertDialogTrigger asChild {...props}>
      {children}
    </Shadcn.AlertDialogTrigger>
  );
};

interface AlertModalContentProps extends Omit<ComponentProps<typeof Shadcn.AlertDialogContent>, "children" | "title"> {
  title: ReactNode;
  description?: ReactNode;
  cancelText?: ReactNode;
  actionText?: ReactNode;
  showCloseButton?: boolean;
  onAction?: () => void;
  onCancel?: () => void;
  actionClassName?: string;
  cancelClassName?: string;
}

const AlertModalContent = ({
  className,
  title,
  description,
  cancelText = "취소",
  actionText = "확인",
  showCloseButton = true,
  onAction,
  onCancel,
  actionClassName,
  cancelClassName,
  ...props
}: AlertModalContentProps) => {
  return (
    <Shadcn.AlertDialogContent
      className={cn(
        "fixed top-1/2 left-1/2 z-50 flex w-[calc(100vw-2rem)] max-w-[31rem] -translate-x-1/2 -translate-y-1/2 flex-col",
        "rounded-[1.75rem] border-0 bg-white px-8 py-8",
        "shadow-[0_1.25rem_3.75rem_rgba(15,23,42,0.12)]",
        "outline-none",
        "max-sm:w-[calc(100vw-1.5rem)] max-sm:rounded-[1.25rem] max-sm:px-5 max-sm:py-6",
        className,
      )}
      {...props}
    >
      {showCloseButton ? (
        <Shadcn.AlertDialogCancel asChild>
          <button
            type="button"
            aria-label="닫기"
            onClick={onCancel}
            className={cn(
              "absolute top-6 right-6 flex h-6 w-6 items-center justify-center",
              "border-0 bg-transparent p-0 text-slate-500 shadow-none",
              "outline-none focus:outline-none focus-visible:ring-0",
              "max-sm:top-5 max-sm:right-5",
            )}
          >
            <X className="h-5 w-5" />
          </button>
        </Shadcn.AlertDialogCancel>
      ) : null}

      <div className="flex w-full flex-col items-center text-center">
        <Shadcn.AlertDialogTitle
          className={cn(
            "mt-6 w-full text-center font-semibold text-[1.5rem] text-gray-900 leading-[1.35]",
            "max-sm:mt-4 max-sm:text-[1.25rem]",
          )}
        >
          {title}
        </Shadcn.AlertDialogTitle>

        {description ? (
          <Shadcn.AlertDialogDescription
            className={cn(
              "mt-3 w-full text-center font-medium text-[1rem] text-slate-500 leading-[1.5]",
              "max-sm:text-[0.9375rem]",
            )}
          >
            {description}
          </Shadcn.AlertDialogDescription>
        ) : null}

        <div className={cn("mt-8 flex w-full items-center gap-3", "max-sm:mt-6 max-sm:gap-2.5")}>
          <Shadcn.AlertDialogCancel asChild>
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                "flex h-[3.25rem] flex-1 items-center justify-center rounded-[1rem]",
                "border border-gray-200 bg-white",
                "font-semibold text-[1rem] text-slate-600",
                "transition-colors hover:bg-gray-50",
                "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
                "max-sm:h-[2.75rem] max-sm:text-[0.9375rem]",
                cancelClassName,
              )}
            >
              {cancelText}
            </button>
          </Shadcn.AlertDialogCancel>

          <Shadcn.AlertDialogAction asChild>
            <button
              type="button"
              onClick={onAction}
              className={cn(
                "flex h-[3.25rem] flex-1 items-center justify-center rounded-[1rem]",
                "border-0 bg-primary",
                "font-semibold text-[1rem] text-white",
                "transition-opacity hover:opacity-90",
                "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
                "max-sm:h-[2.75rem] max-sm:text-[0.9375rem]",
                actionClassName,
              )}
            >
              {actionText}
            </button>
          </Shadcn.AlertDialogAction>
        </div>
      </div>
    </Shadcn.AlertDialogContent>
  );
};

export const AlertModal = Object.assign(AlertModalBase, {
  Trigger: AlertModalTrigger,
  Content: AlertModalContent,
});
