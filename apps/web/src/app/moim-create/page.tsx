import Image from "next/image";
import { icoTitle } from "@/_pages/moim-create";
import { MoimCreateForm } from "@/features/moim-create";

// 임시 gnb 컴포넌트
const PlaceholderGnb = () => <div className="h-[var(--gnb-height)]" />;

export default function Page() {
  return (
    <>
      {/* TODO: 실제 Gnb 컴포넌트로 교체 예정 */}
      <PlaceholderGnb />
      <section className="bg-muted p-4 md:p-6 md:py-[48px]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-5 md:gap-[48px]">
          <header className="flex items-center gap-3 md:gap-[26px]">
            <Image
              src={icoTitle}
              alt=""
              width={102}
              height={82}
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

          <MoimCreateForm />
        </div>
      </section>
    </>
  );
}
