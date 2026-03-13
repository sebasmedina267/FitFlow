export default function Card({ 
  children, 
  title, 
  subtitle,
  actions,
  padding = true,
  className = '' 
}) {
  return (
    <div className={`card ${className}`}>
      {(title || actions) && (
        <div className="card-header">
          <div className="card-header-content">
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="card-actions">{actions}</div>}
        </div>
      )}
      <div className={`card-body ${!padding ? 'no-padding' : ''}`}>
        {children}
      </div>
    </div>
  );
}

Card.Stat = function StatCard({ icon: Icon, title, value, trend, trendValue, variant = 'default' }) {
  return (
    <div className={`stat-card stat-${variant}`}>
      {Icon && (
        <div className="stat-icon">
          <Icon />
        </div>
      )}
      <div className="stat-content">
        <span className="stat-value">{value}</span>
        <span className="stat-title">{title}</span>
        {trend && (
          <span className={`stat-trend trend-${trend}`}>
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
};
