"use client";

import { MoreHorizontal } from "@moum-zip/ui/icons";
import { Button, Dropdown, Tag } from "@ui/components";
import { cn } from "@ui/lib/utils";
import { useState } from "react";
import CrownIcon from "../assets/svg/crown.svg";
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
  viewType?: "member" | "manager";
  isLoggedIn?: boolean;
  initialParticipating?: boolean;
}

export function InformationContainer({
  className,
  viewType = "member",
  isLoggedIn = false,
  initialParticipating = false,
}: InformationContainerProps) {
  const [items, setItems] = useState(initialItems);
  const [isParticipating, setIsParticipating] = useState(initialParticipating);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const isManager = viewType === "manager";

  const handleToggleLike = (id: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, liked: !item.liked } : item)));
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMainButtonClick = () => {
    if (isManager) return;

    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsParticipating((prev) => !prev);
  };

  return (
    <>
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
                  "flex w-full max-w-[630px] flex-col rounded-[40px] bg-white",
                  "gap-[10px] px-[40px] pt-[32px] pb-[32px]",
                  "min-h-[282px]",
                  "max-sm:min-h-[238px] max-sm:max-w-[343px] max-sm:rounded-[20px]",
                  "max-sm:px-[24px] max-sm:pt-[20px] max-sm:pb-[24px]",
                )}
              >
                <div className="flex flex-col gap-6 max-sm:gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
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
                          <Dropdown.Item>수정하기</Dropdown.Item>

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

                  <div className="flex flex-col gap-3 max-sm:gap-2">
                    <div className="flex items-center gap-2 max-sm:gap-1.5">
                      <h3 className="min-w-0 font-semibold text-[28px] text-gray-800 leading-[1.4] max-sm:text-[18px]">
                        {item.title}
                      </h3>

                      {isManager ? <CrownIcon className="h-7 w-7 shrink-0 max-sm:h-5 max-sm:w-5" /> : null}
                    </div>

                    <div className="flex items-center gap-1 text-slate-500">
                      <LocationIcon className="h-4 w-4 shrink-0 text-slate-400" />
                      <span className="font-medium text-[16px] leading-[1.4] max-sm:text-[14px]">{item.category}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-auto">
                  <div className="flex items-center gap-4 max-sm:gap-2">
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

                    {isManager ? (
                      <>
                        <Button type="button" variant="primary" size="large" className="min-w-0 flex-1 max-sm:hidden">
                          공유하기
                        </Button>

                        <Button
                          type="button"
                          variant="primary"
                          size="small"
                          className="hidden min-w-0 flex-1 max-sm:inline-flex"
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
            );
          })}
        </div>
      </section>

      <AlertModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <AlertModal.Content
          title="로그인이 필요한 서비스입니다."
          cancelText="취소"
          actionText="로그인하기"
          onAction={() => setIsLoginModalOpen(false)}
        />
      </AlertModal>
    </>
  );
}
