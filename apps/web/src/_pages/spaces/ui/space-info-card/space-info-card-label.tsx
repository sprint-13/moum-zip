interface SpaceInfoCardLabelProps {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const SpaceInfoCardLabel = ({ icon, children }: SpaceInfoCardLabelProps) => {
  return (
    <div className="flex items-center gap-3 font-medium text-slate-500 text-sm">
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-50">{icon}</div>
      <span>{children}</span>
    </div>
  );
};
