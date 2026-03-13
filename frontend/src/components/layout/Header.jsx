import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';

export default function Header({ onMenuClick }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { admin, logout } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <button className="header-menu-btn" onClick={onMenuClick}>
        <FiMenu />
      </button>

      <div className="header-spacer" />

      <div className="header-user" ref={dropdownRef}>
        <button 
          className="user-button"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="user-avatar">
            {admin?.nombre?.charAt(0)}{admin?.apellidos?.charAt(0)}
          </div>
          <div className="user-info">
            <span className="user-name">{admin?.nombre} {admin?.apellidos}</span>
            <span className="user-role">
              {admin?.rol === 'dueno' ? 'Administrador' : 'Empleado'}
            </span>
          </div>
          <FiChevronDown className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="user-dropdown">
            <button onClick={() => { navigate('/perfil'); setDropdownOpen(false); }}>
              <FiUser /> Mi Perfil
            </button>
            <div className="dropdown-divider" />
            <button onClick={handleLogout} className="logout">
              <FiLogOut /> Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
