import React from 'react';
import '../styles/NavigationBar.css';
import { 
  SearchIcon,
  CalendarCheck, 
  MessageSquare, 
  Bell, 
  ChevronDown 
} from 'lucide-react';

const NavigationBar = () => {
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
        
        <div className="user-profile">
          <span>Some Dude</span>
          <span className="user-role">Admin</span>
          <div className="profile-circle"></div>
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );
};

export default NavigationBar;
