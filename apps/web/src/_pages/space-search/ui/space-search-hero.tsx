import HeroBannerMb from "../assets/hero/banner-mb.svg";
import HeroBannerPc from "../assets/hero/banner-pc.svg";
import HeroBannerTb from "../assets/hero/banner-tb.svg";
import { SPACE_SEARCH_HERO_CONTENT } from "../constants";

export const SpaceSearchHero = () => {
  return (
    <section className="relative bg-accent sm:overflow-hidden sm:rounded-[2rem]">
      <div className="block aspect-375/192 w-full bg-muted sm:hidden">
        <HeroBannerMb aria-hidden="true" className="h-full w-full" focusable="false" />
      </div>
      <div className="hidden aspect-696/244 w-full bg-muted sm:block lg:hidden">
        <HeroBannerTb aria-hidden="true" className="h-full w-full" focusable="false" />
      </div>
      <div className="hidden aspect-1280/244 w-full bg-muted lg:block">
        <HeroBannerPc aria-hidden="true" className="h-full w-full" focusable="false" />
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 flex items-center">
        <div className="w-full px-4 py-8 sm:px-10 sm:py-10 lg:px-14">
          <div className="flex max-w-84 flex-col gap-2">
            <p className={`font-medium text-green-600 text-sm leading-6 tracking-[-0.02em]`}>
              {SPACE_SEARCH_HERO_CONTENT.description}
            </p>
            <h1 className="font-semibold text-[2rem] text-foreground leading-[1.2] tracking-[-0.04em] sm:text-[2.25rem]">
              {SPACE_SEARCH_HERO_CONTENT.title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};
