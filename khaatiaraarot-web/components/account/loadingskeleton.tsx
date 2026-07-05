export default function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-24 bg-[#f0e8e7] rounded-2xl" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-[#f0e8e7] rounded-xl" />
      ))}
    </div>
  );
}