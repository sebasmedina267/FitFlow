import { NavLink } from 'react-router-dom';
import { 
  FiHome, FiUsers, FiCalendar, FiSettings, FiPackage, 
  FiDollarSign, FiPieChart, FiUserCheck, FiActivity
} from 'react-icons/fi';

const navLinks = [
  { path: '/dashboard', icon: FiHome, text: 'Dashboard' },
  { path: '/clientes', icon: FiUsers, text: 'Clientes' },
  { path: '/clases', icon: FiCalendar, text: 'Clases' },
  { path: '/maquinas', icon: FiSettings, text: 'Máquinas' },
  { path: '/productos', icon: FiPackage, text: 'Productos' },
  { path: '/pagos', icon: FiDollarSign, text: 'Pagos' },
  { path: '/economia', icon: FiPieChart, text: 'Economía' },
  { path: '/administradores', icon: FiUserCheck, text: 'Admins' },
];

export default function Sidebar({ isCollapsed }) {
  return (
    <aside className={`app-sidebar ${isCollapsed ? 'is-collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-logo">
          <FiActivity className="logo-icon" />
          {!isCollapsed && <span className="logo-text">FitFlow</span>}
        </div>
      </div>

      <nav className="nav-menu">
        <ul>
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink to={link.path} className="nav-item">
                <link.icon className="nav-icon" />
                {!isCollapsed && <span className="nav-text">{link.text}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
