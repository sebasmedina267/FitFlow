import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiUser, FiLogOut } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import useClickOutside from '../../hooks/useClickOutside';

export default function Header({ onMenuClick, isSidebarCollapsed }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { admin, logout } = useAuthStore();

  useClickOutside(dropdownRef, () => setDropdownOpen(false));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    navigate(path);
    setDropdownOpen(false);
  };
  
  return (
    <header className="app-header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <FiMenu size={22} />
        </button>
      </div>

      <div className="header-right">
        <div className="user-profile" ref={dropdownRef}>
          <button 
            className="user-profile-button"
            onClick={() => setDropdownOpen(prev => !prev)}
          >
            <div className="avatar">
              <span>{admin?.nombre?.charAt(0)}{admin?.apellidos?.charAt(0)}</span>
            </div>
            <div className="user-info">
              <span className="user-name">{admin?.nombre} {admin?.apellidos}</span>
              <span className="user-role">{admin?.rol === 'dueno' ? 'Administrador' : 'Empleado'}</span>
            </div>
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu glow">
              <a onClick={() => handleNavigation('/perfil')}>
                <FiUser />
                <span>Mi Perfil</span>
              </a>
              <a onClick={handleLogout}>
                <FiLogOut />
                <span>Cerrar Sesión</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
