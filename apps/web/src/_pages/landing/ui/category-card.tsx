import Image from "next/image";
import type { Category } from "@/_pages/landing/constants";

interface CategoryCardProps {
  category: Category;
}

export const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <div
      style={{ background: category.gradient }}
      className={`${category.labelColor} flex flex-col items-center justify-between rounded-2xl px-6 py-8 md:aspect-[214/248] md:py-16 lg:aspect-[3/4]`}
    >
      <Image
        src={category.image}
        alt={category.label}
        width={120}
        height={120}
        className="h-[80px] w-[80px] md:h-[140px] md:w-[140px]"
      />
      <span className="w-full min-w-[104px] max-w-[120px] rounded-full bg-white/50 p-1 text-center font-semibold text-sm md:text-xl">
        {category.label}
      </span>
    </div>
  );
};
