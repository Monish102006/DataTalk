export default function SkeletonLoader() {
  return (
    <div className="glass-card gradient-border p-6 animate-skeleton-pulse">
      {/* Title skeleton */}
      <div className="h-5 w-48 bg-white/5 rounded-md mb-6" />

      {/* Chart area skeleton */}
      <div className="h-52 bg-white/[0.02] rounded-lg mb-4 flex items-end justify-around px-6 pb-4 gap-3">
        {[40, 65, 50, 80, 55, 70, 45].map((h, i) => (
          <div
            key={i}
            className="w-8 bg-white/5 rounded-t-md"
            style={{ height: `${h}%` }}
          />
        ))}
      </div>

      {/* Insight skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-full bg-white/5 rounded" />
        <div className="h-3 w-3/4 bg-white/5 rounded" />
      </div>
    </div>
  );
}
