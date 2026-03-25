export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-navy">
      {/* Header skeleton */}
      <section className="pt-20 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="h-10 w-1/2 mx-auto rounded-lg bg-white/5 animate-pulse" />
          <div className="h-5 w-2/3 mx-auto rounded bg-white/5 animate-pulse" />
        </div>
      </section>

      {/* Filter bar skeleton */}
      <section className="pb-6 px-6">
        <div className="max-w-5xl mx-auto flex gap-3 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 rounded-full bg-white/5 animate-pulse shrink-0"
            />
          ))}
        </div>
      </section>

      {/* Blog post grid skeleton */}
      <section className="pb-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <article
              key={i}
              className="rounded-2xl bg-white/5 overflow-hidden animate-pulse"
            >
              <div className="h-44 bg-white/5" />
              <div className="p-5 space-y-3">
                <div className="flex gap-2">
                  <div className="h-5 w-16 rounded-full bg-white/5" />
                  <div className="h-5 w-20 rounded-full bg-white/5" />
                </div>
                <div className="h-6 w-full rounded bg-white/5" />
                <div className="h-4 w-full rounded bg-white/5" />
                <div className="h-4 w-2/3 rounded bg-white/5" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
