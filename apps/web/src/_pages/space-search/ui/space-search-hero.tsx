import { SPACE_SEARCH_HERO_CONTENT } from "../constants";

export const SpaceSearchHero = () => {
  return (
    <section className="relative bg-accent sm:overflow-hidden sm:rounded-[2rem]">
      <picture className="block aspect-375/192 w-full bg-muted sm:aspect-696/244 lg:aspect-1280/244">
        <source media="(min-width: 1024px)" srcSet="/images/space-search/hero/banner-pc.svg" />
        <source media="(min-width: 640px)" srcSet="/images/space-search/hero/banner-tb.svg" />
        <img
          alt=""
          className="block h-full w-full object-cover"
          decoding="async"
          fetchPriority="high"
          height={192}
          src="/images/space-search/hero/banner-mb.svg"
          width={375}
        />
      </picture>

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
