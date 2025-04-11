import React, { useState } from 'react';
import SideBar from "../components/SideBar";
import NavigationBar from '../components/NavigationBar';
import '../styles/profile.css';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Lock, 
  Edit2,
  Save
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "Robert",
    lastName: user?.lastName || "Johnson",
    email: user?.email || "manager@grandhotel.com",
    phone: user?.phone || "+1 (555) 789-4321",
    role: user?.role || "Hotel Administrator",
    department: user?.department || "Management",
    joinDate: user?.joinDate || "2022-06-10",
    permissions: user?.permissions || ["Staff Management", "Booking System", "Facility Access", "Financial Reports"]
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call updateUser from auth context if available
    if (updateUser) {
      updateUser(formData);
    }
    setIsEditing(false);
  };

  return (
    <div className="dashboard">
      <SideBar />
      <NavigationBar />
      
      <div className="dashboard-content">
        <div className="admin-profile-container">
          {/* Removed the profile-header with Admin Profile title */}
          
          <div className="profile-content">
            <div className="profile-sidebar">
              <div className="admin-avatar">
                {formData.firstName[0]}{formData.lastName[0]}
              </div>
              <h2 className="admin-name">{formData.firstName} {formData.lastName}</h2>
              <div className="admin-role">{formData.role}</div>
              <div className="admin-department">{formData.department}</div>
              
              <div className="account-stats">
                <div className="stat-item">
                  <div className="stat-value">243</div>
                  <div className="stat-label">Bookings</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">18</div>
                  <div className="stat-label">Staff</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">5</div>
                  <div className="stat-label">Years</div>
                </div>
              </div>
              
              {/* Profile edit button in sidebar retained */}
              <button 
                className="edit-toggle-btn sidebar-edit-btn"
                onClick={() => isEditing ? handleSubmit() : setIsEditing(true)}
              >
                {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                {isEditing ? " Save Changes" : " Edit Profile"}
              </button>
            </div>

            <div className="profile-details">
              <form onSubmit={handleSubmit}>
                <div className="details-section">
                  <h3 className="section-title">
                    Personal Information
                    
                  </h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <User size={16} />
                        First Name
                      </label>
                      <input 
                        type="text" 
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <User size={16} />
                        Last Name
                      </label>
                      <input 
                        type="text" 
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <Mail size={16} />
                        Email
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <Phone size={16} />
                        Phone
                      </label>
                      <input 
                        type="text" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="details-section">
                  <h3 className="section-title"> Details</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <Shield size={16} />
                        Role
                      </label>
                      <input 
                        type="text" 
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <Calendar size={16} />
                        Join Date
                      </label>
                      <input 
                        type="date" 
                        name="joinDate"
                        value={formData.joinDate}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group full-width">
                    <label>
                      <Lock size={16} />
                      System Permissions
                    </label>
                    <div className="permissions-list">
                      {formData.permissions.map((permission, index) => (
                        <div key={index} className="permission-tag">
                          {permission}
                        </div>
                      ))}
                    </div>
                  </div>
                     
                  <div className="form-group">
                    <button type="button" className="change-password-btn small-btn">
                      Change Password
                    </button>
                  </div>
                </div>
                
               
                {isEditing && (
                  <div className="form-actions">
                    <button type="submit" className="save-btn">Save Changes</button>
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;