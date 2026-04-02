import Image from "next/image";
import {
  bgDoubleOval,
  bgEllipse,
  bgStar,
  heroImage,
  LandingCategoryGrid,
  LandingCtaButton,
  LandingScrollButton,
  spaceLg,
  spaceMd,
  spaceSm,
} from "@/_pages/landing";
import "@/_pages/landing/landing.css";

export default function Home() {
  return (
    <>
      <section className="landing-bg-gradient flex min-h-[calc(100vh-var(--gnb-height))] flex-col overflow-hidden px-5 md:px-[56px] xl:p-0">
        <div className="relative mx-auto flex w-full max-w-[1280px] flex-col gap-10 pt-[72px] md:pt-[136px] lg:flex-row lg:gap-0 lg:pt-[138px] xl:pt-[244px]">
          <div className="flex max-w-[580px] flex-col gap-6 md:gap-8 lg:gap-10">
            <h2 className="flex flex-col gap-2 font-bold text-3xl tracking-tight md:gap-[10px] md:text-5xl md:leading-[60px] lg:text-[56px] lg:leading-[68px]">
              <span className="block">혼자보다 함께,</span>
              <span className="block">모음.zip에서 시작해보세요</span>
            </h2>
            <p className="text-neutral-500 md:text-xl">
              <span className="block">작은 한 걸음도 혼자가 아니면 가벼워집니다.</span>
              <span className="block">당신의 첫 모임, 모음.zip이 도와드릴게요.</span>
            </p>
            <LandingCtaButton size="medium" className="mt-12 min-w-0 max-w-[132px] md:hidden" />
            <LandingCtaButton size="large" className="mt-12 hidden w-[168px] min-w-0 md:inline-flex" />
          </div>
          <Image
            src={heroImage}
            alt="모임을 함께하는 사람들을 표현한 히어로 이미지"
            width={812}
            height={628}
            priority
            sizes="(max-width: 768px) 90vw, (max-width: 1280px) 50vw, 800px"
            className="w-[90vw] object-contain md:absolute md:top-[80%] md:-right-[24px] md:w-[50vw] lg:top-[60%] lg:right-[-10%] xl:top-[138px] xl:-right-[16%] xl:w-[58vw] xl:max-w-[800px]"
          />
        </div>
        <LandingScrollButton />
      </section>

      <section
        id="landing-find"
        className="px-5 py-[64px] md:px-8 md:pt-[80px] md:pb-[120px] lg:px-[72px] lg:pt-[110px] lg:pb-[180px]"
      >
        <div className="flex flex-col items-center justify-center gap-1 lg:gap-2">
          <p className="pb-2 font-semibold text-green-600 text-sm md:text-xl lg:pb-4">모임 찾기</p>
          <h3 className="font-bold text-foreground text-xl leading-[30px] tracking-tight md:text-[40px] md:leading-[56px]">
            다양한 분야의 모임을 만나보세요
          </h3>
          <p className="font-medium text-muted-foreground md:text-xl md:leading-[30px]">
            취향에 따라서 원하는 모임을 골라보세요.
          </p>
        </div>
        <LandingCategoryGrid />
      </section>

      <section className="overflow-hidden bg-gray-100 px-5 py-[64px] md:px-8 md:pt-[80px] md:pb-[120px] lg:px-[72px] lg:pt-[110px] lg:pb-[180px]">
        <div className="mx-auto flex w-full max-w-[1280px] flex-col md:gap-[94px] lg:flex-row lg:justify-between lg:gap-0">
          <div className="flex flex-col justify-center gap-1 text-center lg:shrink-0 lg:gap-2 lg:text-left">
            <p className="pb-2 font-semibold text-green-600 text-sm md:text-xl lg:pb-4">스페이스</p>
            <h3 className="font-bold text-gray-950 text-xl leading-[30px] tracking-tight md:text-[40px] md:leading-[56px]">
              <span className="block">모임 사람들과</span>
              <span className="block">자유롭게 이야기를 나눠보세요</span>
            </h3>
            <p className="font-medium text-neutral-500 md:text-xl md:leading-[30px]">
              <span className="block">일상 속 궁금증, 경험, 생각들을 자유롭게 나누세요.</span>
              <span className="block">웃고 공감하며 함께 즐거움을 나누는 공간입니다.</span>
            </p>
          </div>
          <div className="lg:mr-[-4%] lg:w-[50vw] lg:shrink-0">
            <Image src={spaceSm} alt="모임 스페이스 UI 화면" width={335} height={536} className="w-full md:hidden" />
            <Image
              src={spaceMd}
              alt="모임 스페이스 UI 화면"
              width={680}
              height={705}
              className="hidden w-full md:block lg:hidden"
            />
            <Image
              src={spaceLg}
              alt="모임 스페이스 UI 화면"
              width={1010}
              height={625}
              className="hidden w-full lg:block"
            />
          </div>
        </div>
      </section>

      <section className="landing-bg-gradient relative overflow-hidden px-5 py-[124px] md:py-[200px]">
        <div className="pointer-events-none absolute inset-0">
          <Image src={bgStar} alt="" width={44} height={47} className="absolute top-1/2 left-[10%]" />
          <Image src={bgDoubleOval} alt="" width={390} height={260} className="absolute right-0 bottom-0 md:w-[40vw]" />
        </div>
        <div className="relative flex flex-col items-center gap-[40px] md:gap-[64px]">
          <h2 className="relative text-center font-bold text-2xl tracking-tight md:text-5xl md:leading-[60px] lg:leading-[73px]">
            <Image
              src={bgEllipse}
              alt=""
              width={136}
              height={136}
              className="absolute top-[-70%] left-[-20%] md:top-[-40%] md:left-[-16%] md:h-[200px] md:w-[200px]"
            />
            <span className="relative block text-gray-950">혼자 시작하기 어려웠던 일들,</span>
            <span className="relative mt-2 block text-green-600">모음.zip에서 함께 해요</span>
          </h2>
          <LandingCtaButton size="medium" className="min-w-0 max-w-[140px] md:hidden" />
          <LandingCtaButton size="large" className="hidden w-[168px] min-w-0 md:block" />
        </div>
      </section>
    </>
  );
}
