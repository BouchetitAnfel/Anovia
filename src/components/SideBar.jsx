import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 
import '../styles/SideBar.css';
import Title from './Title.jsx';
import { 
  LayoutDashboard, 
  Wallet, 
  Users2, 
  UserSquare2, 
  Box, 
  LogOut,
  User,
  Hotel,
  Clipboard
} from 'lucide-react';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('Dashboard');
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user, isAdmin } = useAuth();

  const allSidebarItems = [
    { 
      icon: <LayoutDashboard size={20} />, 
      text: 'Dashboard', 
      path: '/dashboard',
      roles: ['admin', 'user', 'manager', 'staff', 'receptionist']
    },
    { 
      icon: <User size={20} />, 
      text: 'Profile', 
      path: '/profile',
      roles: ['admin', 'user', 'manager', 'staff', 'receptionist'] 
    },
    { 
      icon: <Wallet size={20} />, 
      text: 'Budgets', 
      path: '/Budgets',
      roles: ['admin'] 
    },
    { 
      icon: <UserSquare2 size={20} />, 
      text: 'Staff', 
      path: '/staff',
      roles: ['admin'] 
    },
    { 
      icon: <Users2 size={20} />, 
      text: 'Users', 
      path: '/AccountsCreation',
      roles: ['admin']
    },
    { 
      icon: <Box size={20} />, 
      text: 'Resources/Stock', 
      path: '/stock',
      roles: ['admin']
    },
    { 
      icon: <Hotel size={20} />, 
      text: 'Rooms', 
      path: '/Rooms',
      roles: ['receptionist']
    },
    { 
      icon: <Clipboard size={20} />, 
      text: 'Reservation', 
      path: '/Reservation',
      roles: ['receptionist']
    }
  ];

  const getSidebarItems = () => {
    if (!user) return [];
    
    const userRole = user.role || 'user';
    
    return allSidebarItems.filter(item => 
      item.roles.includes(userRole)
    );
  };

  const sidebarItems = getSidebarItems();

  useEffect(() => {
    const currentPath = location.pathname;
    const matchingItem = sidebarItems.find(item => currentPath === item.path);
    
    if (matchingItem) {
      setActiveItem(matchingItem.text);
    }
  }, [location.pathname, sidebarItems]);

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
