import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notifications from './Notifications';
import './Sidebar.css';

function Sidebar({ userRole, userName, userEmail, currentTab, onTabChange, tabs }) {
  const navigate = useNavigate();
  // Start collapsed on mobile devices
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return window.innerWidth <= 768;
  });

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'parent': return '👨‍👩‍👧‍👦';
      case 'teacher': return '👨‍🏫';
      case 'admin': return '👔';
      case 'owner': return '👑';
      default: return '👤';
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'parent': return 'Parent';
      case 'teacher': return 'Teacher';
      case 'admin': return 'School Admin';
      case 'owner': return 'Owner';
      default: return 'User';
    }
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button 
        className="sidebar-toggle-mobile"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isCollapsed ? '☰' : '✕'}
      </button>

      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Logo/Brand */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🎓</span>
            {!isCollapsed && <span className="logo-text">EduckPro</span>}
          </div>
        </div>

        {/* User Info */}
        <div className="sidebar-user">
          <div className="user-avatar">
            {getRoleIcon(userRole)}
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <div className="user-name">{userName || 'User'}</div>
              <div className="user-role">{getRoleLabel(userRole)}</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {tabs && tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange && onTabChange(tab.id);
                // Auto-close sidebar on mobile after selecting a tab
                if (window.innerWidth <= 768) {
                  setIsCollapsed(true);
                }
              }}
              className={`sidebar-nav-item ${currentTab === tab.id ? 'active' : ''}`}
              title={tab.label}
            >
              <span className="nav-icon">{tab.icon}</span>
              {!isCollapsed && <span className="nav-label">{tab.label}</span>}
            </button>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="sidebar-footer">
          {/* Notifications Button */}
          <div className="sidebar-notifications">
            <Notifications />
          </div>
          
          <button 
            className="sidebar-nav-item"
            onClick={handleLogout}
            title="Logout"
          >
            <span className="nav-icon">🚪</span>
            {!isCollapsed && <span className="nav-label">Logout</span>}
          </button>
        </div>

        {/* Desktop toggle button */}
        <button 
          className="sidebar-toggle-desktop"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {!isCollapsed && (
        <div 
          className="sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

export default Sidebar;
