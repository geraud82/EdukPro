import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Building2, 
  Crown, 
  UserCircle, 
  LogOut, 
  Menu, 
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Notifications from './Notifications';
import './Sidebar.css';

function Sidebar({ userRole, userName, userEmail, currentTab, onTabChange, tabs }) {
  const navigate = useNavigate();
  
  // Check if device is mobile
  const isMobile = () => window.innerWidth <= 768;
  
  // Start open on desktop, collapsed on mobile
  const [isCollapsed, setIsCollapsed] = useState(isMobile());

  // Initialize collapsed state based on screen size
  useEffect(() => {
    const handleResize = () => {
      // On mobile, collapse by default; on desktop, expand by default
      if (isMobile()) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Set initial state
    handleResize();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/');
    }
  };

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'parent': return <Users size={24} />;
      case 'teacher': return <BookOpen size={24} />;
      case 'admin': return <Building2 size={24} />;
      case 'owner': return <Crown size={24} />;
      default: return <UserCircle size={24} />;
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
        {isCollapsed ? <Menu size={24} /> : <X size={24} />}
      </button>

      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        {/* Logo/Brand */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon"><GraduationCap size={28} /></span>
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
                if (isMobile()) {
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
            <span className="nav-icon"><LogOut size={20} /></span>
            {!isCollapsed && <span className="nav-label">Logout</span>}
          </button>
        </div>

        {/* Desktop toggle button */}
        <button 
          className="sidebar-toggle-desktop"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
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
