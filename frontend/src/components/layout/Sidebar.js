
import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside>
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/clients">Clientes</Link></li>
          <li><Link to="/payments">Pagos</Link></li>
          <li><Link to="/admins">Administradores</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
