import Image from "next/image";
export const SpaceInfoCardThumbnail = ({ thumbnailUrl, name }: { thumbnailUrl: string; name: string }) => {
  return (
    <div className="relative aspect-video max-h-60 w-full overflow-hidden rounded-lg bg-slate-100">
      <Image src={thumbnailUrl} alt={name} fill className="object-cover" />
    </div>
  );
};
