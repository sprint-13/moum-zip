import { cn } from "@ui/lib/utils";
import { cva } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { GoogleIcon } from "../../icons/google-icon";
import { KakaoIcon } from "../../icons/kakao-icon";

const socialButtonVariants = cva(
  "flex h-12 min-w-[222px] items-center justify-center gap-3 whitespace-nowrap rounded-xl px-6 font-semibold text-[#333333] text-base",
  {
    variants: {
      provider: {
        google: "border border-border-subtle bg-white", // google 테두리 색상 수정
        kakao: "bg-[#FEE500]",
      },
    },
  },
);

const providerConfig = {
  google: { label: "구글로 계속하기", icon: <GoogleIcon /> },
  kakao: { label: "카카오로 계속하기", icon: <KakaoIcon /> },
};

type Provider = keyof typeof providerConfig;

// ButtonHTMLAttribute 확장
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider: Provider;
}

export function SocialButton({ provider, className, ...props }: Props) {
  const { label, icon } = providerConfig[provider];

  return (
    <button type="button" className={cn(socialButtonVariants({ provider }), className)} {...props}>
      {icon}
      {label}
    </button>
  );
}
