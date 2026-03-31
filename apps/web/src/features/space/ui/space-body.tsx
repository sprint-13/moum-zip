import type React from "react";
import { cn } from "@/shared/lib/cn";

type SpaceBodyProps = React.HTMLAttributes<HTMLElement>;

/**
 * :lg 뷰포트에서 3열 그리드 레이아웃을 사용. 왼쪽 영역은 2열을 차지, 오른쪽 영역은 1열을 차지.
 * Left -> Right 순서로 컴포넌트 사용하는 것을 권장.
 */
const SpaceBody = ({ children, className }: SpaceBodyProps) => {
  return <section className={cn("grid grid-cols-1 gap-6 md:mt-12 lg:grid-cols-3", className)}>{children}</section>;
};

type SpaceBodyLeftProps = React.HTMLAttributes<HTMLElement>;

const SpaceBodyLeft = ({ children, className }: SpaceBodyLeftProps) => {
  return <div className={cn("col-span-1 col-start-1 flex flex-col gap-4 lg:col-span-2", className)}>{children}</div>;
};
type SpaceBodyRightProps = React.HTMLAttributes<HTMLElement>;

const SpaceBodyRight = ({ children, className }: SpaceBodyRightProps) => {
  return <div className={cn("col-span-1 flex flex-col gap-4 lg:col-span-1 lg:col-start-3", className)}>{children}</div>;
};

export { SpaceBody, SpaceBodyLeft, SpaceBodyRight };
