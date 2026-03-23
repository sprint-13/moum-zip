export const SpaceHeader = ({ title, description }: { title: string; description: string }) => {
  return (
    <header className="mt-20 mb-10">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="mb-2 font-extrabold text-3xl text-slate-900 tracking-tight">{title}</h1>
          <p className="font-medium text-slate-500">{description}</p>
        </div>
      </div>
    </header>
  );
};
