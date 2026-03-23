"use client";

import { MoreHorizontal } from "@moum-zip/ui/icons";
import { Button, Dropdown, Tag } from "@ui/components";
import { cn } from "@ui/lib/utils";
import { useState } from "react";
import LocationIcon from "../assets/svg/location.svg";
import { AlertModal } from "./alert-modal";
import { LikeButton } from "./like-button";

const initialItems = [
  {
    id: 1,
    deadlineLabel: "오늘 21시 마감",
    dateLabel: "1월 7일",
    timeLabel: "17:30",
    title: "작은 독서 습관 만들기",
    category: "중구 · 취미/여가",
    liked: false,
  },
];

interface InformationContainerProps {
  className?: string;
  showMoreButton?: boolean;
}

export function InformationContainer({ className, showMoreButton = false }: InformationContainerProps) {
  const [items, setItems] = useState(initialItems);

  const handleToggleLike = (id: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, liked: !item.liked } : item)));
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <section className={cn("w-full", className)}>
      <div className="flex flex-col items-center">
        {items.map((item) => {
          const tagItems = [
            {
              key: "deadline",
              label: item.deadlineLabel,
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
              label: item.dateLabel,
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
              label: item.timeLabel,
              desktopProps: {
                tone: "white" as const,
                size: "large" as const,
              },
              mobileProps: {
                tone: "white" as const,
                size: "small" as const,
              },
            },
          ];

          return (
            <article
              key={item.id}
              className={cn(
                "flex h-[282px] w-full max-w-[630px] flex-col rounded-[40px] bg-white",
                "gap-[10px] px-[40px] pt-[34px] pb-[32px]",
                "max-sm:max-w-[343px] max-sm:rounded-[20px]",
                "max-sm:px-[24px] max-sm:pt-[20px] max-sm:pb-[24px]",
              )}
            >
              <div className="flex flex-col gap-[24px] max-sm:gap-[16px]">
                <div className="flex items-start justify-between gap-[12px]">
                  <div className="flex flex-wrap items-center gap-[8px]">
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

                  {showMoreButton ? (
                    <Dropdown>
                      <Dropdown.Trigger>
                        <button
                          type="button"
                          aria-label="더보기"
                          className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                        >
                          <MoreHorizontal className="h-[24px] w-[24px]" />
                        </button>
                      </Dropdown.Trigger>

                      <Dropdown.Content align="end" sideOffset={8}>
                        <Dropdown.Item>공유하기</Dropdown.Item>

                        <AlertModal>
                          <AlertModal.Trigger>
                            <div>
                              <Dropdown.Item onSelect={(e) => e.preventDefault()}>삭제하기</Dropdown.Item>
                            </div>
                          </AlertModal.Trigger>

                          <AlertModal.Content
                            title="모임을 정말 삭제하시겠어요?"
                            description="삭제 후에는 되돌릴 수 없습니다."
                            cancelText="취소"
                            actionText="확인"
                            onAction={() => handleDelete(item.id)}
                          />
                        </AlertModal>
                      </Dropdown.Content>
                    </Dropdown>
                  ) : null}
                </div>

                <div className="flex flex-col gap-[12px] max-sm:gap-[8px]">
                  <h3 className="font-semibold text-[28px] text-gray-800 leading-[1.4] max-sm:text-[18px]">
                    {item.title}
                  </h3>

                  <div className="flex items-center gap-[4px] text-slate-500">
                    <LocationIcon className="h-[16px] w-[16px] shrink-0 text-slate-400" />
                    <span className="font-medium text-[16px] leading-[1.4] max-sm:text-[14px]">{item.category}</span>
                  </div>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex items-center gap-[16px] max-sm:gap-[8px]">
                  <LikeButton
                    isLiked={item.liked}
                    size="lg"
                    className="shrink-0 max-sm:hidden"
                    onClick={() => handleToggleLike(item.id)}
                  />

                  <LikeButton
                    isLiked={item.liked}
                    size="sm"
                    className="hidden shrink-0 max-sm:flex"
                    onClick={() => handleToggleLike(item.id)}
                  />

                  <Button type="button" variant="primary" size="large" className="min-w-0 flex-1 max-sm:hidden">
                    참여하기
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    size="small"
                    className="hidden min-w-0 flex-1 max-sm:inline-flex"
                  >
                    참여하기
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
