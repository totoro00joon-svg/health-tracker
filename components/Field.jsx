export default function Field({ label, error, children }) {
  return (
    <label className="grid gap-2">
      <span className="field-label">{label}</span>
      {children}
      {error && <span className="text-sm font-medium text-rose-600 dark:text-rose-400">{error}</span>}
    </label>
  );
}
