import Image from "next/image";
import { icoTitle } from "@/_pages/moim-create/assets";

export const MoimCreateHeader = () => {
  return (
    <header className="flex items-center gap-3 md:gap-[26px]">
      <Image
        src={icoTitle}
        alt=""
        width={102}
        height={82}
        priority
        fetchPriority="high"
        sizes="(max-width: 767px) 70px, 102px"
        className="h-[56px] w-[70px] md:h-[82px] md:w-[102px]"
      />
      <div className="flex flex-col md:gap-4">
        <h2 className="font-semibold text-foreground text-lg leading-[28px] md:text-[32px] md:leading-[36px]">
          모임 만들기
        </h2>
        <p className="font-medium text-base text-muted-foreground md:text-xl md:leading-[30px]">
          새로운 모임 정보를 입력해주세요 🏠
        </p>
      </div>
    </header>
  );
};
