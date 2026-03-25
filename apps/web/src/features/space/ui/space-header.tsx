import type { ReactNode } from "react";

interface SpaceHeaderProps {
  title: string;
  description?: string;
  buttonGroup?: ReactNode;
}

export const SpaceHeader = ({ title, description, buttonGroup }: SpaceHeaderProps) => {
  const ButtonGroup = buttonGroup ? <div className="flex items-center gap-2">{buttonGroup}</div> : null;

  return (
    <div className="mt-6 hidden items-center justify-between md:flex">
      <div>
        <h1 className="font-bold text-2xl" aria-label="space-top-bar-title">
          {title}
        </h1>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
      <div className="flex items-center gap-2">{ButtonGroup}</div>
    </div>
  );
};
