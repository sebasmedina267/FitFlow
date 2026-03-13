const variants = {
  default: 'badge-default',
  primary: 'badge-primary',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  info: 'badge-info'
};

export default function Badge({ children, variant = 'default', dot = false }) {
  return (
    <span className={`badge ${variants[variant]}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
}
