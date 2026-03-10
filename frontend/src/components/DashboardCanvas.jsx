import ChartCard from './ChartCard';
import SkeletonLoader from './SkeletonLoader';

export default function DashboardCanvas({ charts, isLoading }) {
  const isEmpty = charts.length === 0 && !isLoading;

  return (
    <div className="h-full overflow-y-auto p-6">
      {isEmpty ? (
        <div className="h-full flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/[0.06] flex items-center justify-center">
            <svg className="w-10 h-10 text-dt-text-muted/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
          </div>
          <h3 className="text-lg font-sora font-semibold text-dt-text-muted/60 mb-2">
            Your dashboard awaits
          </h3>
          <p className="text-sm text-dt-text-muted/40 max-w-xs">
            Ask a question to generate your first chart. Try one of the suggested queries in the chat.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {isLoading && <SkeletonLoader />}
          {charts.map((chart, i) => (
            <ChartCard key={chart.id} chart={chart} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
