import Image from "next/image";

interface HeroImageSectionProps {
  image: string | null;
}

export function HeroImageSection({ image }: HeroImageSectionProps) {
  return (
    <div className="relative aspect-[630/400] h-full w-full overflow-hidden rounded-[16px] md:rounded-[20px]">
      {image ? (
        <Image
          src={image}
          alt="모임 대표 이미지"
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 767px) 100vw, 48vw"
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-400 text-sm">
          이미지 영역
        </div>
      )}
    </div>
  );
}
