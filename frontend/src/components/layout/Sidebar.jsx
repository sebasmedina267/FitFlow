import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiCalendar, FiSettings, FiPackage, 
  FiDollarSign, FiPieChart, FiUserCheck, FiChevronLeft, FiActivity
} from 'react-icons/fi';

const navigation = [
  { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { path: '/clientes', icon: FiUsers, label: 'Clientes' },
  { path: '/clases', icon: FiCalendar, label: 'Clases' },
  { path: '/maquinas', icon: FiSettings, label: 'Máquinas' },
  { path: '/productos', icon: FiPackage, label: 'Productos' },
  { path: '/pagos', icon: FiDollarSign, label: 'Pagos' },
  { path: '/economia', icon: FiPieChart, label: 'Economía' },
  { path: '/administradores', icon: FiUserCheck, label: 'Admins' },
];

export default function Sidebar({ isOpen, onToggle }) {
  return (
    <aside className={`sidebar ${isOpen ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-brand">
        <FiActivity className="brand-icon" />
        {isOpen && <span className="brand-text">FitFlow</span>}
      </div>

      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <item.icon className="nav-icon" />
            {isOpen && <span className="nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-toggle" onClick={onToggle}>
        <FiChevronLeft className={`toggle-icon ${!isOpen ? 'rotated' : ''}`} />
      </button>
    </aside>
  );
}
