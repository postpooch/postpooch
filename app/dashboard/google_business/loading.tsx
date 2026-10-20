export default function GoogleBusinessLoading() {
  return (
    <div className="flex min-h-[calc(100dvh-3.75rem)] animate-pulse bg-[#f3f1ee] lg:min-h-dvh">
      <div className="hidden w-[370px] shrink-0 border-r border-pp-sand bg-pp-cream p-5 lg:block">
        <div className="h-3 w-28 rounded bg-pp-sand" /><div className="mt-3 h-7 w-44 rounded bg-pp-sand" />
        <div className="mt-8 h-24 rounded-2xl bg-white" /><div className="mt-5 h-44 rounded-2xl bg-white" />
      </div>
      <div className="mx-auto w-full max-w-[650px] p-8 lg:p-12"><div className="h-[620px] rounded-[28px] bg-white shadow-card-sm" /></div>
    </div>
  );
}
