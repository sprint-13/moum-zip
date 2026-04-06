"use client";

import { Pagination } from "@moum-zip/ui/components";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

interface MemberPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function MemberPagination({ currentPage, totalPages }: MemberPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  function handlePageChange(page: number) {
    const next = new URLSearchParams(searchParams.toString());
    next.set("page", String(page));
    startTransition(() => router.push(`?${next.toString()}`));
  }

  return (
    <Pagination
      ariaLabel="멤버 페이지네이션"
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
      previousAriaLabel="이전 페이지"
      nextAriaLabel="다음 페이지"
      size="responsive"
    />
  );
}
