const btn =
  'w-full inline-flex items-center justify-center py-3 px-5 text-[15px] font-semibold text-white bg-[#1a1d21] rounded-lg hover:bg-[#2d3238] disabled:opacity-60 disabled:cursor-not-allowed transition-colors';

export default function AuthForm({ title, subtitle, error, success, onSubmit, loading, submitLabel, children, hideFormOnSuccess, submitDisabled }) {
  const showForm = !hideFormOnSuccess || !success;
  const disabled = loading || submitDisabled;
  return (
    <>
      <h1 className="m-0 mb-2 text-2xl font-bold text-[#1a1d21] tracking-tight">{title}</h1>
      {subtitle && <p className="m-0 mb-8 text-[15px] text-[#2d3238]">{subtitle}</p>}
      <form className="flex flex-col gap-5" onSubmit={onSubmit}>
        {error && <div className="p-3 rounded-lg text-sm bg-red-50 text-red-600 border border-red-200">{error}</div>}
        {success && <div className="p-3 rounded-lg text-sm bg-green-50 text-green-700 border border-green-200">{success}</div>}
        {showForm && children}
        {showForm && <button type="submit" className={btn} disabled={disabled}>{loading ? 'Loading…' : submitLabel}</button>}
      </form>
    </>
  );
}
