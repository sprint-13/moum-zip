"use client";

import { MoreHorizontal } from "@moum-zip/ui/icons";
import { Button, Dropdown, Tag } from "@ui/components";
import { cn } from "@ui/lib/utils";
import { useState } from "react";
import CrownIcon from "../assets/svg/crown.svg";
import LocationIcon from "../assets/svg/location.svg";
import type { InformationData } from "../model/types";
import { AlertModal } from "./alert-modal";
import { LikeButton } from "./like-button";

type ViewType = "member" | "manager";

interface InformationContainerProps {
  data: InformationData;
  className?: string;
  viewType?: ViewType;
  isLoggedIn?: boolean;
  isParticipating?: boolean;
  onToggleLike?: (meetingId: number) => void;
  onParticipateToggle?: (meetingId: number, nextParticipating: boolean) => void;
  onShare?: (meetingId: number) => void;
  onEdit?: (meetingId: number) => void;
  onDelete?: (meetingId: number) => void;
  onLoginAction?: () => void;
}

export function InformationContainer({
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
}: InformationContainerProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isManager = viewType === "manager";

  const tagItems = [
    {
      key: "deadline",
      label: data.deadlineLabel,
      desktopProps: {
        tone: "blue" as const,
        size: "large" as const,
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
        size: "large" as const,
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
        size: "large" as const,
      },
      mobileProps: {
        tone: "white" as const,
        size: "small" as const,
      },
    },
  ].filter((item) => item.label);

  const handleMainButtonClick = () => {
    if (isManager) {
      return;
    }

    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    onParticipateToggle?.(data.id, !isParticipating);
  };

  const handleDeleteConfirm = () => {
    onDelete?.(data.id);
    setIsDeleteModalOpen(false);
  };

  const handleLoginConfirm = () => {
    setIsLoginModalOpen(false);
    onLoginAction?.();
  };

  return (
    <>
      <section className={cn("w-full", className)}>
        <article
          className={cn(
            "mx-auto flex w-full max-w-[630px] flex-col items-start gap-2.5",
            "rounded-[32px] bg-white",
            "px-10 pt-8.5 pb-8",
            "max-sm:rounded-[20px]",
            "max-sm:px-6 max-sm:pt-5 max-sm:pb-6",
          )}
        >
          <div className="flex w-full flex-col gap-6 max-sm:gap-4">
            <div className="flex w-full items-start justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
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
                      <MoreHorizontal className="h-6 w-6" />
                    </button>
                  </Dropdown.Trigger>

                  <Dropdown.Content align="end" sideOffset={8}>
                    <Dropdown.Item onSelect={() => onEdit?.(data.id)}>수정하기</Dropdown.Item>

                    <Dropdown.Item
                      onSelect={() => {
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      삭제하기
                    </Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown>
              ) : null}
            </div>

            <div className="flex w-full flex-col gap-3 max-sm:gap-2">
              <div className="flex min-w-0 items-center gap-2 max-sm:gap-1.5">
                <h3 className="min-w-0 break-words font-semibold text-[28px] text-gray-800 leading-[1.4] max-sm:text-[18px]">
                  {data.title}
                </h3>

                {isManager ? <CrownIcon className="h-7 w-7 shrink-0 max-sm:h-5 max-sm:w-5" /> : null}
              </div>

              <div className="flex min-w-0 items-center gap-1 text-slate-500">
                <LocationIcon className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="min-w-0 break-words font-medium text-[16px] leading-[1.4] max-sm:text-[14px]">
                  {data.category}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-auto w-full">
            <div className="flex w-full items-center gap-4 max-sm:gap-2">
              <LikeButton
                isLiked={data.isLiked}
                size="lg"
                className="shrink-0 max-sm:hidden"
                onClick={() => onToggleLike?.(data.id)}
              />

              <LikeButton
                isLiked={data.isLiked}
                size="sm"
                className="hidden shrink-0 max-sm:flex"
                onClick={() => onToggleLike?.(data.id)}
              />

              {isManager ? (
                <>
                  <Button
                    type="button"
                    variant="primary"
                    size="large"
                    className="min-w-0 flex-1 max-sm:hidden"
                    onClick={() => onShare?.(data.id)}
                  >
                    공유하기
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    size="small"
                    className="hidden min-w-0 flex-1 max-sm:inline-flex"
                    onClick={() => onShare?.(data.id)}
                  >
                    공유하기
                  </Button>
                </>
              ) : isParticipating ? (
                <>
                  <Button
                    type="button"
                    variant="secondary"
                    size="large"
                    className="min-w-0 flex-1 border border-primary bg-white text-green-600 max-sm:hidden"
                    onClick={handleMainButtonClick}
                  >
                    참여 취소하기
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    className="hidden min-w-0 flex-1 border border-primary bg-white text-green-600 max-sm:inline-flex"
                    onClick={handleMainButtonClick}
                  >
                    참여 취소하기
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="primary"
                    size="large"
                    className="min-w-0 flex-1 max-sm:hidden"
                    onClick={handleMainButtonClick}
                  >
                    참여하기
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    size="small"
                    className="hidden min-w-0 flex-1 max-sm:inline-flex"
                    onClick={handleMainButtonClick}
                  >
                    참여하기
                  </Button>
                </>
              )}
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
}
