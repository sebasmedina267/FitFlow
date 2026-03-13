import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

export default function PieChartCard({ 
  title, 
  data = [], 
  dataKey = 'value',
  nameKey = 'name',
  height = 300,
  showLegend = true,
  innerRadius = 0
}) {
  const chartData = data && data.length > 0 ? data : [{ name: 'Sin datos', value: 0, color: '#cbd5e1' }];
  
  return (
    <div className="chart-card">
      {title && <h3 className="chart-card__title">{title}</h3>}
      <div className="chart-card__content" style={{ height: `${Math.max(height, 280)}px`, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius="80%"
              paddingAngle={2}
              dataKey={dataKey}
              nameKey={nameKey}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: '#64748b' }}
            >
              {chartData?.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            {showLegend && (
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span style={{ color: '#334155', fontSize: '12px' }}>{value}</span>}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
