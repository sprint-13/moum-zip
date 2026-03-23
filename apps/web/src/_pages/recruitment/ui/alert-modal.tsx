"use client";

import { X } from "@moum-zip/ui/icons";
import { Button } from "@ui/components";
import * as Shadcn from "@ui/components/shadcn/alert-dialog";
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
    <>
      <Shadcn.AlertDialogOverlay className="fixed inset-0 z-50 bg-black/50" />

      <Shadcn.AlertDialogContent
        className={cn(
          "w-[calc(100%-32px)] max-w-fit rounded-[40px] border-0 bg-white p-[48px_40px_40px] shadow-[0_0_50px_0_rgba(0,0,0,0.08)]",
          "max-sm:w-[calc(100%-24px)] max-sm:rounded-[32px] max-sm:p-[40px_24px_24px]",
          className,
        )}
        {...props}
      >
        <div className="inline-flex w-full max-w-[480px] flex-col gap-[16px]">
          {showCloseButton ? (
            <div className="flex w-full justify-end">
              <Shadcn.AlertDialogCancel asChild>
                <button
                  type="button"
                  aria-label="닫기"
                  className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <X className="h-[20px] w-[20px]" />
                </button>
              </Shadcn.AlertDialogCancel>
            </div>
          ) : null}

          <div className="flex w-full max-w-[480px] flex-col items-center gap-[56px]">
            <Shadcn.AlertDialogHeader className="w-full items-center gap-[8px] text-center">
              <Shadcn.AlertDialogTitle className="w-full text-center font-semibold text-[20px] text-gray-800 leading-[1.4] max-sm:text-[18px]">
                {title}
              </Shadcn.AlertDialogTitle>

              {description ? (
                <Shadcn.AlertDialogDescription className="w-full text-center font-medium text-[16px] text-slate-400 leading-[1.4] max-sm:text-[14px]">
                  {description}
                </Shadcn.AlertDialogDescription>
              ) : null}
            </Shadcn.AlertDialogHeader>

            <div className="flex w-full items-center gap-[14px] max-sm:gap-[10px]">
              <Shadcn.AlertDialogCancel asChild>
                <Button
                  type="button"
                  variant="secondary"
                  size="large"
                  onClick={onCancel}
                  className={cn(
                    "h-[56px] min-w-0 flex-1 rounded-[16px] px-6 font-semibold text-[16px]",
                    "border-slate-200 text-slate-600 hover:bg-slate-50",
                    "max-sm:h-[52px] max-sm:px-4 max-sm:text-[15px]",
                    cancelClassName,
                  )}
                >
                  {cancelText}
                </Button>
              </Shadcn.AlertDialogCancel>

              <Shadcn.AlertDialogAction asChild>
                <Button
                  type="button"
                  variant="primary"
                  size="large"
                  onClick={onAction}
                  className={cn(
                    "h-[56px] min-w-0 flex-1 rounded-[16px] px-6 font-semibold text-[16px]",
                    "max-sm:h-[52px] max-sm:px-4 max-sm:text-[15px]",
                    actionClassName,
                  )}
                >
                  {actionText}
                </Button>
              </Shadcn.AlertDialogAction>
            </div>
          </div>
        </div>
      </Shadcn.AlertDialogContent>
    </>
  );
};

export const AlertModal = Object.assign(AlertModalBase, {
  Trigger: AlertModalTrigger,
  Content: AlertModalContent,
});
