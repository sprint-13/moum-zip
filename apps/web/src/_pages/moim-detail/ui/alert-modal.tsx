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
        "fixed top-1/2 left-1/2 z-50 flex w-full max-w-140 -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2.5",
        "rounded-[40px] bg-white px-10 py-10",
        "shadow-[0_0_50px_0_rgba(0,0,0,0.08)]",
        "border-0 outline-none",
        "max-sm:max-w-[calc(100vw-24px)] max-sm:rounded-[24px] max-sm:p-6",
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
              "absolute top-12 right-10 flex h-6 w-6 shrink-0 items-center justify-center",
              "appearance-none border-0 bg-transparent p-0 text-slate-600 shadow-none",
              "outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0",
              "max-sm:top-6 max-sm:right-6",
            )}
          >
            <X className="h-6 w-6" />
          </button>
        </Shadcn.AlertDialogCancel>
      ) : null}

      <div className="flex w-full flex-col items-center text-center">
        <Shadcn.AlertDialogTitle
          className={cn(
            "mt-16 w-full text-center font-semibold text-2xl text-gray-900 leading-[1.4]",
            "max-sm:mt-7 max-sm:text-lg",
          )}
        >
          {title}
        </Shadcn.AlertDialogTitle>

        {description ? (
          <Shadcn.AlertDialogDescription
            className={cn(
              "mt-3 w-full text-center font-semibold text-lg text-slate-500 leading-[1.4]",
              "max-sm:text-base",
            )}
          >
            {description}
          </Shadcn.AlertDialogDescription>
        ) : null}

        <div className={cn("mt-12 flex w-full items-center gap-4", "max-sm:mt-8 max-sm:gap-3")}>
          <Shadcn.AlertDialogCancel asChild>
            <button
              type="button"
              onClick={onCancel}
              className={cn(
                "flex h-15 flex-1 items-center justify-center rounded-[16px]",
                "border border-gray-200 bg-white",
                "font-semibold text-slate-600 text-xl",
                "outline-none transition-colors hover:bg-gray-50",
                "focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
                "max-sm:h-10 max-sm:text-sm",
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
                "flex h-15 flex-1 items-center justify-center rounded-[16px]",
                "border-0 bg-primary",
                "font-semibold text-white text-xl",
                "outline-none transition-opacity hover:opacity-90",
                "focus:outline-none focus-visible:outline-none focus-visible:ring-0",
                "max-sm:h-10 max-sm:text-sm",
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
