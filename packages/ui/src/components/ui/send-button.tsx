type Props = { icon: React.ReactNode };

export function SendButton({ icon }: Props) {
  return (
    <button
      type="button"
      className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center"
    >
      <div className="w-6 h-6">{icon}</div>
    </button>
  );
}
