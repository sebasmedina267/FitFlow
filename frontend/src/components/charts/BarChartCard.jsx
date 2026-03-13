import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function BarChartCard({ 
  title, 
  data = [], 
  dataKey, 
  xAxisKey = 'name',
  color = '#6366f1',
  secondaryDataKey,
  secondaryColor = '#10b981',
  height = 300 
}) {
  const chartData = data && data.length > 0 ? data : [{ [xAxisKey]: 'Sin datos', [dataKey]: 0 }];
  
  return (
    <div className="chart-card">
      {title && <h3 className="chart-card__title">{title}</h3>}
      <div className="chart-card__content" style={{ height: `${Math.max(height, 280)}px`, width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%" minHeight={280}>
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            {secondaryDataKey && <Legend />}
            <Bar 
              dataKey={dataKey} 
              fill={color} 
              radius={[4, 4, 0, 0]}
              name={dataKey}
            />
            {secondaryDataKey && (
              <Bar 
                dataKey={secondaryDataKey} 
                fill={secondaryColor} 
                radius={[4, 4, 0, 0]}
                name={secondaryDataKey}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
