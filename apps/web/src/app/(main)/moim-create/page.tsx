import { MoimCreateHeader } from "@/_pages/moim-create";
import { MoimCreateForm, MoimCreatePageTracking } from "@/features/moim-create";

export default function Page() {
  return (
    <section className="p-4 md:p-6 md:py-[48px]">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-5 md:gap-[48px]">
        <MoimCreatePageTracking />
        <MoimCreateHeader />
        <MoimCreateForm />
      </div>
    </section>
  );
}
