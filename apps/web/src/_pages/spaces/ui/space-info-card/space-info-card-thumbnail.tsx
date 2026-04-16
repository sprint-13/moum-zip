import Image from "next/image";

interface SpaceInfoCardThumbnailProps {
  thumbnailUrl: string;
  name: string;
  priority?: boolean;
}

export const SpaceInfoCardThumbnail = ({ thumbnailUrl, name, priority = false }: SpaceInfoCardThumbnailProps) => {
  return (
    <div className="relative aspect-video max-h-60 w-full overflow-hidden rounded-lg bg-slate-100">
      <Image
        src={thumbnailUrl}
        alt={name}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
      />
    </div>
  );
};
