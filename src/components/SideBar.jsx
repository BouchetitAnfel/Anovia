import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { logout } = useAuth(); // Call useAuth hook at the top level of your component

  const sidebarItems = [
    { icon: <LayoutDashboard size={20} />, text: 'Dashboard', path: '/dashboard' },
    { icon: <Wallet size={20} />, text: 'Budgets', path: '/budgets' },
    { icon: <ListTodo size={20} />, text: 'Tasks', path: '/tasks' },
    { icon: <Layers size={20} />, text: 'Services', path: '/services' },
    { icon: <CalendarClock size={20} />, text: 'Schedule', path: '/schedule' },
    { icon: <UserSquare2 size={20} />, text: 'Staff', path: '/staff' },
    { icon: <Users2 size={20} />, text: 'Users', path: '/users' },
    { icon: <Box size={20} />, text: 'Resources/Stock', path: '/stock' },
    { icon: <Settings size={20} />, text: 'Settings', path: '/settings' }
  ];

  const handleItemClick = (item) => {
    setActiveItem(item.text);
    navigate(item.path);
  };
  
  const handleLogout = async () => {
    try {
      await logout(); // This will call the logout method from your AuthContext
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Optionally, add user-facing error handling here
      // For example:
      // setErrorMessage('Logout failed. Please try again.');
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