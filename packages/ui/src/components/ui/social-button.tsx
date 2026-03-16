import googleIcon from "@ui/icons/google.svg";
import kakaoIcon from "@ui/icons/kakao.svg";
import { cn } from "@ui/lib/utils";
import { cva } from "class-variance-authority";

const socialButtonVariants = cva(
  "flex items-center justify-center gap-3 w-[222px] h-12 px-6 rounded-xl font-semibold text-[#333333] text-base",
  {
    variants: {
      provider: {
        google: "bg-white border",
        kakao: "bg-[#FEE500]",
      },
    },
  },
);

const providerConfig = {
  google: { label: "구글로 계속하기", icon: googleIcon },
  kakao: { label: "카카오로 계속하기", icon: kakaoIcon },
};

type Provider = keyof typeof providerConfig;

interface Props {
  provider: Provider;
}

export function SocialButton({ provider }: Props) {
  const { label, icon } = providerConfig[provider];

  return (
    <button type="button" className={cn(socialButtonVariants({ provider }))}>
      <img src={icon} width={20} height={20} alt="" />
      {label}
    </button>
  );
}
