import { cloneElement } from "react";

type Props = {
  icon: React.ReactElement<{ size?: number }>;
};

export function EditButton({ icon }: Props) {
  const styledIcon = cloneElement(icon, { size: 20 });

  return (
    <button
      type="button"
      className="w-10 h-10 rounded-full bg-white border border-slate-200 text-gray-600 flex items-center justify-center"
    >
      {styledIcon}
    </button>
  );
}
