import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div className="content-wrapper">
        <Header 
          onMenuClick={toggleSidebar} 
          isSidebarCollapsed={isSidebarCollapsed} 
        />
        <main className="content-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
