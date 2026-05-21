export default function SectionHeader({ eyebrow, title, children }) {
  return (
    <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{eyebrow}</p>}
        <h2 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}
