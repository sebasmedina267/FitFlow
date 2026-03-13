import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'primary',
  format = 'number'
}) {
  const formatValue = (val) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('es-ES', { 
        style: 'currency', 
        currency: 'EUR' 
      }).format(val);
    }
    if (format === 'percent') {
      return `${val}%`;
    }
    return val?.toLocaleString('es-ES') ?? '0';
  };

  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-card__icon">
        {Icon && <Icon />}
      </div>
      <div className="stat-card__content">
        <span className="stat-card__title">{title}</span>
        <span className="stat-card__value">{formatValue(value)}</span>
        {trend && (
          <div className={`stat-card__trend stat-card__trend--${trend}`}>
            {trend === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}
