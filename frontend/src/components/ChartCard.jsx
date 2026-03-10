import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';

const COLORS = ['#00d4ff', '#00ff88', '#ff6b6b', '#ffd93d', '#c084fc', '#fb923c', '#38bdf8'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0d1526] border border-white/10 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-dt-accent-cyan text-xs font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-xs text-dt-text-primary">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.color }} />
          {p.name}: <span className="font-mono font-medium">{typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</span>
        </p>
      ))}
    </div>
  );
};

function renderChart(chartType, data, xKey, yKey) {
  const commonAxisProps = {
    tick: { fill: '#5a6a85', fontSize: 11, fontFamily: 'IBM Plex Mono' },
    axisLine: { stroke: 'rgba(255,255,255,0.06)' },
    tickLine: false
  };

  const gridProps = {
    strokeDasharray: '3 3',
    stroke: 'rgba(255,255,255,0.04)'
  };

  switch (chartType) {
    case 'line':
      return (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey={xKey} {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey={yKey} stroke="#00d4ff" strokeWidth={2.5}
              fill="url(#lineGrad)" dot={{ r: 3, fill: '#00d4ff', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#00d4ff', stroke: '#0d1526', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity={0.3} />
              </linearGradient>
            </defs>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey={xKey} {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={yKey} fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data} dataKey={yKey} nameKey={xKey} cx="50%" cy="45%"
              outerRadius={85} innerRadius={40}
              stroke="rgba(7,11,20,0.8)" strokeWidth={2}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: '#5a6a85' }}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: '#5a6a85' }} />
          </PieChart>
        </ResponsiveContainer>
      );

    case 'scatter':
      return (
        <ResponsiveContainer width="100%" height={240}>
          <ScatterChart margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
            <CartesianGrid {...gridProps} />
            <XAxis dataKey={xKey} name={xKey} {...commonAxisProps} />
            <YAxis dataKey={yKey} name={yKey} {...commonAxisProps} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.1)' }} />
            <Scatter data={data} fill="#00d4ff">
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      );

    case 'table':
      return (
        <div className="overflow-auto max-h-[260px]">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-white/10">
                {Object.keys(data[0] || {}).map(key => (
                  <th key={key} className="text-left py-2 px-3 text-dt-text-muted font-medium sticky top-0 bg-[#0a1020]">
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  {Object.values(row).map((val, j) => (
                    <td key={j} className="py-1.5 px-3 text-dt-text-primary/80">
                      {typeof val === 'number' ? val.toLocaleString() : val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    default:
      return <p className="text-dt-text-muted text-sm text-center py-8">Unknown chart type: {chartType}</p>;
  }
}

export default function ChartCard({ chart, index }) {
  const { chart_type, title, data, x_key, y_key, insight, sql_query } = chart;

  return (
    <div
      className="glass-card gradient-border p-5 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Title */}
      <h3 className="text-sm font-sora font-semibold text-dt-text-primary mb-4 flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${
          chart_type === 'line' ? 'bg-dt-accent-cyan' :
          chart_type === 'bar' ? 'bg-dt-accent-green' :
          chart_type === 'pie' ? 'bg-purple-400' :
          chart_type === 'scatter' ? 'bg-amber-400' :
          'bg-dt-text-muted'
        }`} />
        {title}
      </h3>

      {/* Chart */}
      {renderChart(chart_type, data, x_key, y_key)}

      {/* Insight */}
      {insight && (
        <p className="text-xs text-dt-text-muted mt-4 pt-3 border-t border-white/[0.04] leading-relaxed">
          💡 {insight}
        </p>
      )}
    </div>
  );
}
