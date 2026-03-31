"use client";

import { cn } from "@ui/lib/utils";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES } from "@/_pages/landing/constants";
import { CategoryCard } from "@/_pages/landing/ui/category-card";

export function LandingCategoryGrid() {
  const containerRef = useRef<HTMLUListElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setShown(true);
        observer.unobserve(entry.target);
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <ul
      ref={containerRef}
      className="mt-12 grid grid-cols-2 gap-4 md:mt-20 md:grid-cols-3 lg:mt-[94px] lg:grid-cols-6 lg:gap-6"
    >
      {CATEGORIES.map((category) => (
        <li
          key={category.label}
          className={cn(
            "lg:transition-[opacity,transform] lg:duration-900 lg:ease-out lg:odd:mt-10",
            shown ? "lg:translate-y-0 lg:opacity-100" : "lg:translate-y-6 lg:opacity-0",
          )}
        >
          <CategoryCard category={category} />
        </li>
      ))}
    </ul>
  );
}
