import React, { useState, useEffect } from 'react';
import SideBar from "../components/SideBar";
import NavigationBar from '../components/NavigationBar';
import '../styles/profile.css';
import { useParams, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import { User, Mail, Phone, Calendar, Shield, Lock, Edit2, Save, CreditCard, Home } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  
  const permissionsByRole = {
    admin: ["Staff Management", "Booking System", "Facility Access", "Financial Reports", "System Settings"],
    manager: ["Staff Scheduling", "Room Management", "Customer Service", "Basic Reports"],
    receptionist: ["Manage Rooms", "Modify Room State", "Make Reservations", "Modify Reservations"],
    housekeeper: ["Manage Room Status"]
  };
  
  const [employeeData, setEmployeeData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "+1 (555) 000-0000",
    role: "",
    joinDate: "",
    address: "",
    ccp: "",
    active: true,
    permissions: []
  });

  const isAdmin = user?.role === "admin";
  const hasEditPermission = isAdmin;
  const fetchEmployeeProfile = async () => {
    try {
      setIsLoading(true);
      
      // Case 1: Data provided directly in location state (from Staff page or navigation components)
      if (location.state?.employeeData) {
        const employee = location.state.employeeData;
        setEmployeeData({
          id: employee.id,
          firstName: employee.first_name || "",
          lastName: employee.last_name || "",
          email: employee.email || "",
          phone: employee.phone || "+1 (555) 000-0000",
          role: employee.role || "",
          joinDate: employee.hire_date || new Date().toISOString().split('T')[0],
          address: employee.address || employee.adresse || "",
          ccp: employee.ccp || "",
          active: employee.active === undefined ? true : employee.active,
          permissions: permissionsByRole[employee.role?.toLowerCase()] || []
        });
        setIsLoading(false);
        return;
      }
      
      // Case 2: Using current user data if the ID matches (for personal profile)
      if (id && user && user.id === parseInt(id)) {
        setEmployeeData({
          id: user.id,
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          email: user.email || "",
          phone: user.phone || "+1 (555) 000-0000",
          role: user.role || "",
          joinDate: user.hire_date || new Date().toISOString().split('T')[0],
          address: user.address || user.adresse || "",
          ccp: user.ccp || "",
          active: true,
          permissions: permissionsByRole[user.role?.toLowerCase()] || []
        });
        setIsLoading(false);
        return;
      }
      
      // Case 3: API fetch for any other scenario when we have an ID
      if (id) {
        try {
          const response = await api.get(`/employees/${id}`);
          if (response.data && response.data.success) {
            const employee = response.data.employee;
            setEmployeeData({
              id: employee.id,
              firstName: employee.first_name || "",
              lastName: employee.last_name || "",
              email: employee.email || "",
              phone: employee.phone || "+1 (555) 000-0000",
              role: employee.role || "",
              joinDate: employee.hire_date || "",
              address: employee.address || employee.adresse || "",
              ccp: employee.ccp || "",
              active: employee.active === undefined ? true : employee.active,
              permissions: permissionsByRole[employee.role?.toLowerCase()] || []
            });
          } else {
            throw new Error('Failed to fetch employee data');
          }
        } catch (apiError) {
          console.error("API error:", apiError);
          
          // Fallback: If API call fails, try to use the current user data
          if (user) {
            console.log("Falling back to current user data");
            setEmployeeData({
              id: user.id,
              firstName: user.first_name || "",
              lastName: user.last_name || "",
              email: user.email || "",
              phone: user.phone || "+1 (555) 000-0000",
              role: user.role || "",
              joinDate: user.hire_date || new Date().toISOString().split('T')[0],
              address: user.address || "",
              ccp: user.ccp || "",
              active: true,
              permissions: permissionsByRole[user.role?.toLowerCase()] || []
            });
          } else {
            throw new Error('Could not load profile data');
          }
        }
      } else if (user) {
        // Case 4: No ID provided but we have a logged-in user - show current user's profile
        setEmployeeData({
          id: user.id,
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          email: user.email || "",
          phone: user.phone || "+1 (555) 000-0000", 
          role: user.role || "",
          joinDate: user.hire_date || new Date().toISOString().split('T')[0],
          address: user.address || "",
          ccp: user.ccp || "",
          active: true,
          permissions: permissionsByRole[user.role?.toLowerCase()] || []
        });
      } else {
        throw new Error('No profile data available');
      }
    } catch (err) {
      console.error("Error fetching employee profile:", err);
      setError(err.message || "Failed to load employee data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeProfile();
  }, [id, location.state, user]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData({
      ...employeeData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!hasEditPermission) {
      setError("You don't have permission to edit profiles");
      setIsEditing(false);
      return;
    }
    
    try {
      const dataToSend = {
        first_name: employeeData.firstName,
        last_name: employeeData.lastName,
        email: employeeData.email,
        address: employeeData.address,
        ccp: employeeData.ccp,
        hire_date: employeeData.joinDate,
      };
      
      if (employeeData.id) {
        await api.post(`/employees/${employeeData.id}/modify`, dataToSend);
        alert("Employee details updated successfully!");
      } else {
        await api.post('/employees/create', dataToSend);
        alert("New employee created successfully!");
      }
      
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating employee:", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  if (isLoading) return <div className="loading">Loading employee data...</div>;
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
                {employeeData.firstName[0]}{employeeData.lastName[0]}
              </div>
              <h2 className="admin-name">{employeeData.firstName} {employeeData.lastName}</h2>
              <div className="admin-role">{employeeData.role}</div>
              
              <div className="account-stats">
                <div className="stat-item">
                  <div className="stat-value">{employeeData.active ? "Active" : "Inactive"}</div>
                  <div className="stat-label">Status</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {new Date(employeeData.joinDate).getFullYear()}
                  </div>
                  <div className="stat-label">Joined</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{employeeData.permissions.length}</div>
                  <div className="stat-label">Permissions</div>
                </div>
              </div>
              
              {hasEditPermission && (
                <button 
                  className="edit-toggle-btn sidebar-edit-btn"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <Save size={18} /> : <Edit2 size={18} />}
                  {isEditing ? " Save Changes" : " Edit Profile"}
                </button>
              )}
            </div>

            <div className="profile-details">
              <form onSubmit={handleSubmit}>
                <div className="details-section">
                  <h3 className="section-title">Employee Information</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <User size={16} />
                        First Name
                      </label>
                      <input 
                        type="text" 
                        name="firstName"
                        value={employeeData.firstName}
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
                        value={employeeData.lastName}
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
                        value={employeeData.email}
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
                        value={employeeData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="details-section">
                  <h3 className="section-title">Employment Details</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <Shield size={16} />
                        Role
                      </label>
                      <select 
                        name="role"
                        value={employeeData.role}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      >
                        <option value="">Select Role</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="receptionist">Receptionist</option>
                        <option value="housekeeper">Housekeeper</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <Calendar size={16} />
                        Hire Date
                      </label>
                      <input 
                        type="date" 
                        name="joinDate"
                        value={employeeData.joinDate}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <CreditCard size={16} />
                        CCP
                      </label>
                      <input 
                        type="text" 
                        name="ccp"
                        value={employeeData.ccp}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        maxLength={8}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <Home size={16} />
                        Address
                      </label>
                      <input 
                        type="text" 
                        name="address"
                        value={employeeData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="form-group full-width">
                    <label>
                      <Lock size={16} />
                      Role Permissions
                    </label>
                    <div className="permissions-list">
                      {employeeData.permissions.length > 0 ? (
                        employeeData.permissions.map((permission, index) => (
                          <div key={index} className="permission-tag">
                            {permission}
                          </div>
                        ))
                      ) : (
                        <div className="no-permissions">No permissions assigned</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {isEditing && hasEditPermission && (
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