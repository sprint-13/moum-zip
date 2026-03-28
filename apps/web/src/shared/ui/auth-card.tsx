import type { ReactNode } from "react";

interface AuthCardProps {
  children: ReactNode;
}

export const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <div className="flex min-h-screen items-start justify-center pt-16 pb-16 md:pt-20 md:pb-20">
      <div className="min-h-[570px] w-[343px] rounded-2xl bg-white px-4 py-8 md:min-h-[592px] md:w-[568px] md:px-14 md:py-12">
        {children}
      </div>
    </div>
  );
};
