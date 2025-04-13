import React from 'react';
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

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`;
    }
    return 'SD';  
  };

  const getFullName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return "Some Dude"; 
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
          <CalendarCheck size={20} />
          <MessageSquare size={20} />
          <Bell size={20} />
        </div>
        
        <div className="user-profile" onClick={handleProfileClick}>
          <div className="user-info">
            <div className="user-name">{getFullName()}</div>
            <div className="user-role">{user?.role || "Admin"}</div>
          </div>
          <div className="profile-circle">
            {getInitials()}
          </div>
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;