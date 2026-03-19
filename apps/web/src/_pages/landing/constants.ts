import type { StaticImageData } from "next/image";
import { categoryBusiness, categoryEtc, categoryFamily, categoryHealth, categoryHobby, categoryStudy } from "./assets";

export type Category = {
  label: string;
  image: StaticImageData;
  gradient: string;
  labelColor: string;
};

export const CATEGORIES: Category[] = [
  {
    label: "취미 / 여가",
    image: categoryHobby,
    gradient: "linear-gradient(180deg, #71DEAB 0%, #7AEBB8 100%)",
    labelColor: "text-green-600",
  },
  {
    label: "스터디",
    image: categoryStudy,
    gradient: "linear-gradient(180deg, #FF8686 0%, #FFABAB 100%)",
    labelColor: "text-red-600",
  },
  {
    label: "비즈니스",
    image: categoryBusiness,
    gradient: "linear-gradient(180deg, #64ABFF 0%, #91C4FF 100%)",
    labelColor: "text-sky-600",
  },
  {
    label: "운동 / 건강",
    image: categoryHealth,
    gradient: "linear-gradient(180deg, #FBD537 0%, #F9E343 100%)",
    labelColor: "text-amber-600",
  },
  {
    label: "가족 / 육아",
    image: categoryFamily,
    gradient: "linear-gradient(180deg, #32D6C1 0%, #57E6D1 100%)",
    labelColor: "text-teal-600",
  },
  {
    label: "기타",
    image: categoryEtc,
    gradient: "linear-gradient(180deg, #FC9744 0%, #FDB36B 100%)",
    labelColor: "text-orange-500",
  },
];
