export default function FreeGuideLoading() {
  return (
    <div className="min-h-screen bg-navy">
      {/* Hero skeleton */}
      <section className="pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="h-6 w-40 mx-auto rounded-full bg-gold/10 animate-pulse" />
          <div className="h-10 w-3/4 mx-auto rounded-lg bg-white/5 animate-pulse" />
          <div className="h-6 w-2/3 mx-auto rounded bg-white/5 animate-pulse" />
          <div className="h-5 w-1/2 mx-auto rounded bg-white/5 animate-pulse" />
        </div>
      </section>

      {/* Form skeleton */}
      <section className="pb-16 px-6">
        <div className="max-w-md mx-auto rounded-2xl bg-white/5 p-8 space-y-5 animate-pulse">
          <div className="h-6 w-2/3 mx-auto rounded bg-white/5" />
          <div className="space-y-4">
            <div className="h-12 w-full rounded-lg bg-white/5" />
            <div className="h-12 w-full rounded-lg bg-white/5" />
            <div className="h-14 w-full rounded-xl bg-gold/10" />
          </div>
          <div className="h-4 w-3/4 mx-auto rounded bg-white/5" />
        </div>
      </section>

      {/* Benefits skeleton */}
      <section className="pb-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/5 p-6 space-y-3 animate-pulse"
            >
              <div className="h-10 w-10 rounded-lg bg-gold/10" />
              <div className="h-5 w-2/3 rounded bg-white/5" />
              <div className="h-4 w-full rounded bg-white/5" />
              <div className="h-4 w-3/4 rounded bg-white/5" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
