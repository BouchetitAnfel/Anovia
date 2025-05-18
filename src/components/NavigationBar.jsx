import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/NavigationBar.css';
import { 
  SearchIcon,
  CalendarCheck, 
  MessageSquare, 
  Bell, 
  ChevronDown 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NavigationBar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleProfileClick = useCallback((e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    
    if (!user?.id) {
      console.error("Cannot navigate - no user ID");
      return;
    }
  
    const profilePath = `/Profile/${user.id}`;
    console.log("Navigating to:", profilePath);
    
    navigate(profilePath, {
      replace: false,
      state: { 
        from: 'navbar',
        employeeData: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role,
          active: true,
          hire_date: user.hire_date,
          address: user.address,
          ccp: user.ccp
        }
      }
    });
  }, [user, navigate]);

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return 'GU'; // Default for Guest User
  };

  const getFullName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user?.email || "Guest User";
  };

  return (
    <div className="top-navigation-bar">
      <div className="search-container">
        <div className="relative w-full">
          <input  
            type="text" 
            placeholder="Search for anything..." 
            className="search-input w-full px-3 py-2 pl-10 rounded-full border bg-gray-100 focus:outline-none"
          />
          <SearchIcon 
            size={20} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
      
      <div className="nav-right">
        <div className="nav-icons">
          <CalendarCheck size={20} className="nav-icon" />
          <MessageSquare size={20} className="nav-icon" />
          <Bell size={20} className="nav-icon" />
        </div>
        
        <div 
          className="user-profile clickable"
          onClick={handleProfileClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleProfileClick(e)}
        >
          <div className="user-info">
            <div className="user-name">{getFullName()}</div>
            <div className="user-role">{user?.role || "Guest"}</div>
          </div>
          <div className="profile-circle">
            {getInitials()}
          </div>
          <ChevronDown size={16} className="dropdown-icon" />
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;