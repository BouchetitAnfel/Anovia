import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Adjust path based on your project structure
import '../styles/SideBar.css';
import Title from './Title.jsx';
import { 
  LayoutDashboard, 
  Wallet, 
  ListTodo, 
  Layers, 
  CalendarClock, 
  Users2, 
  UserSquare2, 
  Box, 
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const navigate = useNavigate();
  const location = useLocation(); // Add this to track the current route
  const { logout } = useAuth();

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, text: 'Dashboard', path: '/dashboard' },
    { icon: <Wallet size={20} />, text: 'Budgets', path: '/Budgets' },
    { icon: <ListTodo size={20} />, text: 'Tasks', path: '/tasks' },
    { icon: <Layers size={20} />, text: 'Services', path: '/services' },
    { icon: <CalendarClock size={20} />, text: 'Schedule', path: '/schedule' },
    { icon: <UserSquare2 size={20} />, text: 'Staff', path: '/staff' },
    { icon: <Users2 size={20} />, text: 'Users', path: '/users' },
    { icon: <Box size={20} />, text: 'Resources/Stock', path: '/stock' },
    { icon: <Settings size={20} />, text: 'Settings', path: '/settings' }
  ];

  // Update active item when route changes
  useEffect(() => {
    const currentPath = location.pathname;
    const matchingItem = sidebarItems.find(item => currentPath === item.path);
    
    if (matchingItem) {
      setActiveItem(matchingItem.text);
    }
  }, [location.pathname]);

  const handleItemClick = (item) => {
    setActiveItem(item.text);
    navigate(item.path);
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-logo">
        <div className="logo-container">
          <Title />
        </div>
        <button 
          className="collapse-btn" 
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? '»' : '«'}
        </button>
      </div>
      
      <nav className="sidebar-menu">
        {sidebarItems.map((item) => (
          <div 
            key={item.text} 
            className={`sidebar-item ${activeItem === item.text ? 'active' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            {item.icon}
            {!isCollapsed && <span>{item.text}</span>}
          </div>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div 
          className="sidebar-item logout-item"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;