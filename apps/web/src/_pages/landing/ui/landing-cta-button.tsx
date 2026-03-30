"use client";

import { Button } from "@ui/components";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/config/routes";

type Props = {
  size: "medium" | "large";
  className?: string;
};

export const LandingCtaButton = ({ size, className }: Props) => {
  const router = useRouter();
  const handleClick = () => router.push(ROUTES.search);

  return (
    <Button size={size} className={className} onClick={handleClick}>
      모임 찾아보기
    </Button>
  );
};
