import { cn } from "@ui/lib/utils";
import { cva } from "class-variance-authority";
import { GoogleIcon } from "../../icons/google-icon";
import { KakaoIcon } from "../../icons/kakao-icon";

const socialButtonVariants = cva(
  "flex items-center justify-center gap-3 min-w-[222px] h-12 px-6 rounded-xl font-semibold text-[#333333] text-base whitespace-nowrap",
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
  google: { label: "구글로 계속하기", icon: <GoogleIcon /> },
  kakao: { label: "카카오로 계속하기", icon: <KakaoIcon /> },
};

type Provider = keyof typeof providerConfig;

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
