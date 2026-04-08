import Link from "next/link";
import Logo from "@/shared/assets/moum-zip-logo.svg";

export default function NotFound() {
  return (
    <div className="pointer-events-auto fixed z-10 flex h-dvh w-full items-center justify-center p-[16px]">
      <div className="flex h-full flex-col items-center justify-center gap-8">
        <h1 className="font-bold text-2xl">요청하신 페이지를 찾을 수 없습니다.</h1>
        <div className="inline-flex flex-col items-center">
          <p className="text-gray-500">페이지가 삭제되었거나 변경되었을 수 있습니다.</p>
          <p className="text-gray-500">입력한 주소를 다시 확인해주세요.</p>
        </div>
        <Link
          href="/"
          className="rounded-lg bg-primary px-4 py-3 font-semibold text-white transition-colors hover:bg-primary/90"
        >
          홈 화면으로
        </Link>
      </div>
      <Logo className="absolute bottom-[40px] size-20" />
    </div>
  );
}
