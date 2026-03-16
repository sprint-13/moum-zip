import { cloneElement } from "react";

type Props = {
  icon: React.ReactElement<{ size?: number }>;
};

export function DeleteButton({ icon }: Props) {
  const styledIcon = cloneElement(icon, { size: 8 });

  return (
    <button
      type="button"
      className="w-[18px] h-[18px] rounded-full bg-black/80 text-white flex items-center justify-center"
    >
      {styledIcon}
    </button>
  );
}
