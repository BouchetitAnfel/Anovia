import React, { useState, useEffect } from 'react';
import SideBar from "../components/SideBar";
import NavigationBar from '../components/NavigationBar';
import '../styles/profile.css';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import { User, Mail, Phone, Calendar, Shield, Lock, Edit2, Save } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const defaultPermissions = ["Staff Management", "Booking System", "Facility Access", "Financial Reports"];
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+1 (555) 789-4321",
    role: "",
    joinDate: "2022-06-10",
    permissions: defaultPermissions
  });

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/profile');
      const userData = response.data;
      
      setFormData({
        firstName: userData.first_name || "",
        lastName: userData.last_name || "",
        email: userData.email || "",
        phone: formData.phone,
        role: userData.role || "",
        joinDate: formData.joinDate,
        permissions: defaultPermissions
      });
      
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.response?.data?.message || err.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const dataToSend = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone
      };
      
      await api.put('/profile/update', dataToSend);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        firstName: user.first_name || user.firstName || "",
        lastName: user.last_name || user.lastName || "",
        email: user.email || "",
        role: user.role || ""
      }));
    }
  }, [user]);

  if (isLoading && !user) return <div className="loading">Loading profile data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="dashboard">
      <SideBar />
      <NavigationBar />
      
      <div className="dashboard-content">
        <div className="admin-profile-container">
          <div className="profile-content">
            <div className="profile-sidebar">
              <div className="admin-avatar">
                {formData.firstName[0]}{formData.lastName[0]}
              </div>
              <h2 className="admin-name">{formData.firstName} {formData.lastName}</h2>
              <div className="admin-role">{formData.role}</div>
              
              <div className="account-stats">
                <div className="stat-item">
                  <div className="stat-value">36,254</div>
                  <div className="stat-label">Bookings</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">48</div>
                  <div className="stat-label">Staff</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">5</div>
                  <div className="stat-label">Years</div>
                </div>
              </div>
              
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
                  <h3 className="section-title">Personal Information</h3>
                  
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
                  <h3 className="section-title">Details</h3>
                  
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
                        disabled={true}
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