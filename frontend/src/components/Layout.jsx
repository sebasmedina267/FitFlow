import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiTool,
  FiShoppingBag,
  FiDollarSign,
  FiPieChart,
  FiUserCheck,
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import useAuthStore from "../store/authStore";

export function PageHeader({ title, subtitle }) {
  return (
    <div className="page-header">
      <div className="page-header-content">
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
    </div>
  );
}

const menuItems = [
  { path: "/dashboard", icon: FiHome, label: "Dashboard" },
  { path: "/clientes", icon: FiUsers, label: "Clientes" },
  { path: "/clases", icon: FiCalendar, label: "Clases" },
  { path: "/maquinas", icon: FiTool, label: "Máquinas" },
  { path: "/productos", icon: FiShoppingBag, label: "Productos" },
  { path: "/pagos", icon: FiDollarSign, label: "Pagos" },
  { path: "/economia", icon: FiPieChart, label: "Economía" },
  { path: "/administradores", icon: FiUserCheck, label: "Administradores" },
];

function SidebarItem({ path, icon, label, active, collapsed }) {
  const Icon = icon;

  return (
    <Link to={path} className={`nav-item ${active ? "active" : ""}`}>
      <Icon className="nav-icon" />
      {!collapsed && <span className="nav-label">{label}</span>}
    </Link>
  );
}

export default function Layout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuthStore();

  const toggleSidebar = () => setCollapsed((prev) => !prev);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`layout ${collapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">{collapsed ? "FF" : "FitFlow"}</div>

          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {collapsed ? <FiMenu /> : <FiX />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <SidebarItem
                key={item.path}
                {...item}
                active={isActive}
                collapsed={collapsed}
              />
            );
          })}
        </nav>
      </aside>

      <div className="main-wrapper">
        <header className="navbar">
          <div className="navbar-left">
            <button className="menu-btn" onClick={toggleSidebar}>
              <FiMenu />
            </button>
          </div>

          <div className="navbar-right">
            <div className="admin-info" onClick={() => navigate("/perfil")}>
              <FiUser className="admin-icon" />

              <div className="admin-meta">
                <span className="admin-name">
                  {admin?.nombre} {admin?.apellidos}
                </span>

                <span className="admin-role">
                  {admin?.rol === "dueno" ? "Dueño" : "Empleado"}
                </span>
              </div>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              <FiLogOut />
            </button>
          </div>
        </header>

        <main className="main-content">{children}</main>
      </div>
    </div>
  );
}
