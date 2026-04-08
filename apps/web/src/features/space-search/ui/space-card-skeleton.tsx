const skeletonCardClassName =
  "relative flex w-full min-w-0 flex-col gap-0 overflow-hidden rounded-[2rem] bg-card shadow-[0_10px_24px_rgba(17,17,17,0.09)] sm:gap-6 sm:overflow-visible sm:p-6 md:flex-row md:items-center lg:gap-5 lg:p-5 2xl:gap-6 2xl:p-6";
const skeletonImageClassName =
  "h-39 w-full rounded-none bg-muted sm:h-50 sm:rounded-3xl md:size-42.5 lg:size-40 2xl:size-42.5";
const skeletonBlockClassName = "rounded-full bg-muted";

export const SpaceCardSkeleton = () => {
  return (
    <div className="rounded-[2.25rem]">
      <article aria-hidden="true" className={`${skeletonCardClassName} animate-pulse`}>
        <div className="relative w-full shrink-0 sm:w-full md:w-auto">
          <div className={skeletonImageClassName} />
          <div className="absolute top-4 right-4 size-10 rounded-full bg-muted sm:hidden" />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-5 p-4 sm:p-0">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-2">
                <div className="h-7 w-3/5 max-w-52 rounded-full bg-muted" />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className={`h-4 w-24 ${skeletonBlockClassName}`} />
                <div className={`h-4 w-14 ${skeletonBlockClassName}`} />
              </div>
            </div>

            <div className="hidden size-10 rounded-full bg-muted sm:block" />
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 lg:gap-2.5 2xl:gap-3">
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className={`h-5 w-32 ${skeletonBlockClassName}`} />
              <div className={`h-3.5 w-full max-w-64.5 ${skeletonBlockClassName} lg:max-w-60 2xl:max-w-64.5`} />
            </div>
            <div className="h-12 min-w-26 shrink-0 rounded-xl bg-muted lg:h-11 lg:min-w-24 2xl:h-12 2xl:min-w-26" />
          </div>
        </div>
      </article>
    </div>
  );
};
