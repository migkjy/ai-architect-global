export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-navy">
      {/* Header skeleton */}
      <section className="pt-20 pb-12 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="h-10 w-2/3 mx-auto rounded-lg bg-white/5 animate-pulse" />
          <div className="h-5 w-1/2 mx-auto rounded bg-white/5 animate-pulse" />
        </div>
      </section>

      {/* Bundle card skeleton */}
      <section className="pb-8 px-6">
        <div className="max-w-2xl mx-auto rounded-2xl border border-gold/20 bg-white/5 p-8 space-y-6 animate-pulse">
          <div className="h-8 w-1/2 mx-auto rounded bg-white/5" />
          <div className="h-12 w-32 mx-auto rounded bg-gold/10" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-4 w-3/4 mx-auto rounded bg-white/5" />
            ))}
          </div>
          <div className="h-14 w-56 mx-auto rounded-xl bg-gold/10" />
        </div>
      </section>

      {/* Individual products skeleton */}
      <section className="pb-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/5 p-6 space-y-4 animate-pulse"
            >
              <div className="h-40 rounded-lg bg-white/5" />
              <div className="h-5 w-3/4 rounded bg-white/5" />
              <div className="h-4 w-full rounded bg-white/5" />
              <div className="h-8 w-20 rounded bg-gold/10" />
              <div className="h-10 w-full rounded-lg bg-gold/10" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
