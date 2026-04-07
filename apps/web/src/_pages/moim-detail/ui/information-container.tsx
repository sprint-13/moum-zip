"use client";

import { MoreHorizontal } from "@moum-zip/ui/icons";
import { Button, Dropdown, Tag } from "@ui/components";
import { cn } from "@ui/lib/utils";
import { useState } from "react";
import CrownIcon from "@/_pages/moim-detail/assets/crown.svg";
import LocationIcon from "@/_pages/moim-detail/assets/location.svg";
import { AlertModal } from "@/_pages/moim-detail/ui/alert-modal";
import type { InformationData } from "@/entities/moim-detail";
import { LikeButton } from "@/features/moim-detail/ui/like-button";

type ViewType = "member" | "manager";
type ActionButtonVariant = "primary" | "secondary" | "success";

interface InformationContainerProps {
  data: InformationData;
  className?: string;
  viewType?: ViewType;
  isLoggedIn?: boolean;
  isParticipating?: boolean;
  onToggleLike?: () => boolean | Promise<boolean>;
  onParticipateToggle?: (meetingId: number, nextParticipating: boolean) => void;
  onShare?: (meetingId: number) => void;
  onEdit?: (meetingId: number) => void;
  onDelete?: (meetingId: number) => void;
  onLoginAction?: () => void;
}

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  variant?: ActionButtonVariant;
  disabled?: boolean;
}

const ActionButton = ({ label, onClick, variant = "primary", disabled = false }: ActionButtonProps) => {
  const secondaryClassName =
    variant === "secondary" ? "border border-primary bg-white text-green-600 hover:bg-green-50" : "";

  const successClassName =
    variant === "success"
      ? "border border-sky-200 bg-sky-50 text-sky-700 shadow-none cursor-default hover:bg-sky-50"
      : "";

  const disabledClassName = disabled && variant !== "success" ? "cursor-not-allowed opacity-60 active:scale-100" : "";

  const resolvedVariant = variant === "success" ? "secondary" : variant;

  return (
    <>
      <Button
        type="button"
        variant={resolvedVariant}
        size="large"
        disabled={disabled}
        className={cn(
          "min-w-0 flex-1 max-sm:hidden",
          "transition-all duration-200 active:scale-[0.985]",
          "h-12 px-4 text-[15px]",
          disabledClassName,
          secondaryClassName,
          successClassName,
        )}
        onClick={onClick}
      >
        {label}
      </Button>

      <Button
        type="button"
        variant={resolvedVariant}
        size="small"
        disabled={disabled}
        className={cn(
          "hidden min-w-0 flex-1 max-sm:inline-flex",
          "transition-all duration-200 active:scale-[0.985]",
          "h-10 px-3 text-sm",
          disabledClassName,
          secondaryClassName,
          successClassName,
        )}
        onClick={onClick}
      >
        {label}
      </Button>
    </>
  );
};

export const InformationContainer = ({
  data,
  className,
  viewType = "member",
  isLoggedIn = false,
  isParticipating = false,
  onToggleLike,
  onParticipateToggle,
  onShare,
  onEdit,
  onDelete,
  onLoginAction,
}: InformationContainerProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isManager = viewType === "manager";
  const canJoin = data.actionState.canJoin;
  const canCancelJoin = data.actionState.canCancelJoin;
  const isCanceledMeeting = data.status === "canceled";

  const tagItems = [
    {
      key: "deadline",
      label: data.deadlineLabel,
      desktopProps: {
        tone: "blue" as const,
        size: "small" as const,
        icon: true,
      },
      mobileProps: {
        tone: "blue" as const,
        size: "small" as const,
        icon: true,
      },
    },
    {
      key: "date",
      label: data.dateLabel,
      desktopProps: {
        tone: "white" as const,
        size: "small" as const,
      },
      mobileProps: {
        tone: "white" as const,
        size: "small" as const,
      },
    },
    {
      key: "time",
      label: data.timeLabel,
      desktopProps: {
        tone: "white" as const,
        size: "small" as const,
      },
      mobileProps: {
        tone: "white" as const,
        size: "small" as const,
      },
    },
  ].filter((item) => item.label);

  const handleLikeClick = async (): Promise<boolean> => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return false;
    }

    if (!onToggleLike) {
      return true;
    }

    return await onToggleLike();
  };

  const handleMainButtonClick = () => {
    if (isManager) {
      return;
    }

    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    if (canJoin) {
      onParticipateToggle?.(data.id, true);
      return;
    }

    if (canCancelJoin) {
      onParticipateToggle?.(data.id, false);
    }
  };

  const handleDeleteConfirm = () => {
    onDelete?.(data.id);
    setIsDeleteModalOpen(false);
  };

  const handleLoginConfirm = () => {
    setIsLoginModalOpen(false);
    onLoginAction?.();
  };

  const actionButtonProps: ActionButtonProps = isManager
    ? {
        label: "공유하기",
        onClick: () => onShare?.(data.id),
        variant: "secondary",
      }
    : canCancelJoin
      ? {
          label: "신청 취소하기",
          onClick: handleMainButtonClick,
          variant: "secondary",
        }
      : canJoin
        ? {
            label: "신청하기",
            onClick: handleMainButtonClick,
            variant: "primary",
          }
        : isParticipating
          ? {
              label: "신청 완료",
              onClick: () => undefined,
              variant: "success",
              disabled: true,
            }
          : {
              label: isCanceledMeeting ? "모집 취소" : "모집 마감",
              onClick: () => undefined,
              variant: "primary",
              disabled: true,
            };

  return (
    <>
      <section className={cn("w-full", className)}>
        <article
          className={cn(
            "mx-auto flex w-full flex-col items-start gap-4",
            "rounded-2xl border border-slate-100 bg-white",
            "px-6 py-6",
            "shadow-[0_8px_24px_rgba(15,23,42,0.04)]",
            "transition-all duration-200",
            "max-sm:gap-4",
            "max-sm:rounded-20px",
            "max-sm:px-4 max-sm:py-4",
          )}
        >
          <div className="flex w-full flex-col gap-4 max-sm:gap-3">
            <div className="flex w-full items-start justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                {tagItems.map(({ key, label, desktopProps, mobileProps }) => (
                  <div key={key}>
                    <Tag {...desktopProps} className="max-sm:hidden">
                      {label}
                    </Tag>
                    <Tag {...mobileProps} className="hidden max-sm:inline-flex">
                      {label}
                    </Tag>
                  </div>
                ))}
              </div>

              {isManager ? (
                <Dropdown>
                  <Dropdown.Trigger>
                    <button
                      type="button"
                      aria-label="더보기"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </Dropdown.Trigger>

                  <Dropdown.Content align="end" sideOffset={8}>
                    <Dropdown.Item onSelect={() => onEdit?.(data.id)}>수정하기</Dropdown.Item>
                    <Dropdown.Item onSelect={() => setIsDeleteModalOpen(true)}>삭제하기</Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown>
              ) : null}
            </div>

            <div className="flex w-full flex-col gap-2 max-sm:gap-1.5">
              <div className="flex min-w-0 items-start gap-1.5">
                <h3 className="min-w-0 break-words font-semibold text-[20px] text-gray-800 leading-[1.4] max-sm:text-[18px]">
                  {data.title}
                </h3>

                {isManager ? <CrownIcon className="mt-0.5 h-6 w-6 shrink-0 max-sm:h-5 max-sm:w-5" /> : null}
              </div>

              <div className="flex min-w-0 items-center gap-1 text-slate-500">
                <LocationIcon className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span className="min-w-0 break-words font-medium text-sm leading-[1.4] max-sm:text-[13px]">
                  {data.category}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-auto w-full">
            <div className="flex w-full items-center gap-3 max-sm:gap-2">
              <LikeButton isLiked={data.isLiked} onLike={handleLikeClick} />
              <div className="flex min-w-0 flex-1 items-center gap-3 max-sm:gap-2">
                <ActionButton {...actionButtonProps} />
              </div>
            </div>
          </div>
        </article>
      </section>

      <AlertModal open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertModal.Content
          title="모임을 정말 삭제하시겠어요?"
          description="삭제 후에는 되돌릴 수 없습니다."
          cancelText="취소"
          actionText="확인"
          onAction={handleDeleteConfirm}
        />
      </AlertModal>

      <AlertModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <AlertModal.Content
          title="로그인이 필요한 서비스입니다."
          cancelText="취소"
          actionText="로그인하기"
          onAction={handleLoginConfirm}
        />
      </AlertModal>
    </>
  );
};
