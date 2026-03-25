export default function LocaleLoading() {
  return (
    <div className="min-h-screen bg-navy">
      {/* Hero skeleton */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="h-10 w-3/4 mx-auto rounded-lg bg-white/5 animate-pulse" />
          <div className="h-6 w-2/3 mx-auto rounded bg-white/5 animate-pulse" />
          <div className="h-6 w-1/2 mx-auto rounded bg-white/5 animate-pulse" />
          <div className="h-14 w-48 mx-auto rounded-xl bg-gold/10 animate-pulse mt-8" />
        </div>
      </section>

      {/* Product cards skeleton */}
      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/5 p-6 space-y-4 animate-pulse"
            >
              <div className="h-48 rounded-lg bg-white/5" />
              <div className="h-5 w-3/4 rounded bg-white/5" />
              <div className="h-4 w-full rounded bg-white/5" />
              <div className="h-4 w-2/3 rounded bg-white/5" />
              <div className="h-10 w-32 rounded-lg bg-gold/10 mt-4" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
