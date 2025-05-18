import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SideBar from "../components/SideBar";
import NavigationBar from '../components/NavigationBar';
import '../styles/Staff.css';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';
import { Modal, Button } from 'react-bootstrap';

const Staff = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('all');
    const [staffData, setStaffData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletionError, setDeletionError] = useState(null);
  
    const roles = ['all', 'admin', 'manager', 'receptionist', 'housekeeper', 'maintenance'];
    const isAdmin = user && user.role === 'admin';
  const staticStaffData = [
    {
      id: "S001",
      first_name: "John",
      last_name: "Smith",
      email: "john.smith@hotel.com",
      role: "manager",
      active: true
    },
    {
      id: "S002",
      first_name: "Emily",
      last_name: "Johnson",
      email: "emily.j@hotel.com",
      role: "receptionist",
      active: true
    },
    {
      id: "S003",
      first_name: "Michael",
      last_name: "Brown",
      email: "michael.b@hotel.com",
      role: "maintenance",
      active: true
    },
    {
      id: "S004",
      first_name: "Sarah",
      last_name: "Davis",
      email: "sarah.d@hotel.com",
      role: "housekeeper",
      active: true
    },
    {
      id: "S005",
      first_name: "Robert",
      last_name: "Wilson",
      email: "robert.w@hotel.com",
      role: "manager",
      active: false
    },
    {
      id: "S006",
      first_name: "Jessica",
      last_name: "Taylor",
      email: "jessica.t@hotel.com",
      role: "receptionist",
      active: true
    },
    {
      id: "S007",
      first_name: "David",
      last_name: "Thomas",
      email: "david.t@hotel.com",
      role: "maintenance",
      active: false
    },
    {
      id: "S008",
      first_name: "Jennifer",
      last_name: "Martinez",
      email: "jennifer.m@hotel.com",
      role: "housekeeper",
      active: true
    },
    {
      id: "S009",
      first_name: "James",
      last_name: "Anderson",
      email: "james.a@hotel.com",
      role: "receptionist",
      active: true
    },
    {
      id: "S010",
      first_name: "Lisa",
      last_name: "Jackson",
      email: "lisa.j@hotel.com",
      role: "housekeeper",
      active: true
    }
  ];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/employees/Listemployees');
      
      if (response.data && response.data.success) {
        const transformedData = response.data['The employees'].map(emp => ({
          id: emp.id,
          first_name: emp.first_name,
          last_name: emp.last_name,
          email: emp.email,
          role: emp.role || 'employee', 
          active: true, 
          hire_date: emp.hire_date,
          address: emp.adresse || emp.address,
          ccp: emp.ccp
        }));
        
        setStaffData(transformedData);
      } else {
        throw new Error('Failed to fetch employee data');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setStaffData(staticStaffData);
      setError('Failed to load employee data from API. Using sample data instead.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      setStaffData(prevData => prevData.filter(emp => emp.id !== id));
      setDeletionError(null);
    } catch (error) {
      console.error('Error deleting employee:', error);
      setDeletionError('Failed to delete employee. Please try again.');
      setTimeout(() => setDeletionError(null), 3000);
    }
  };

  const handleNewEmployee = () => {
    navigate('/AccountsCreation'); 
  };

  const navigateToProfile = (employee) => {
    navigate(`/Profile/${employee.id}`, {
      state: {
        employeeData: {
          id: employee.id,
          first_name: employee.first_name,
          last_name: employee.last_name,
          email: employee.email,
          role: employee.role,
          active: employee.active,
          hire_date: employee.hire_date,
          address: employee.address,
          ccp: employee.ccp
        }
      }
    });
  };

  const getFilteredStaff = () => {
    if (activeTab === 'all') {
      return staffData;
    }
    return staffData.filter(staff => staff.role.toLowerCase() === activeTab);
  };

  const filteredStaff = getFilteredStaff();

  const getStaffStats = () => {
    const totalStaff = staffData.length;
    const activeStaff = staffData.filter(staff => staff.active).length;
    
    return [
      {
        title: 'Total Staff',
        value: totalStaff,
        change: '+2',
        isPositive: true
      },
      {
        title: 'Active Staff',
        value: activeStaff,
        change: '+1',
        isPositive: true
      }
    ];
  };

  const summaryCards = getStaffStats();

  return (
    <div className="staff-page">
      <SideBar />
      <NavigationBar />
      <div className="staff-content">
        <div className="staff-content-inner">
          <div className="staff-header">
            <h2>Staff Directory</h2>
            {isAdmin && (
              <button 
                onClick={handleNewEmployee}
                className="new-employee-btn"
              >
                New Employee
              </button>
            )}
          </div>

          {deletionError && (
            <div className="error-message">
              {deletionError}
            </div>
          )}

          <div className="staff-summary">
            {summaryCards.map((card, index) => (
              <div className="staff-card" key={index}>
                <h3 className="card-title">{card.title}</h3>
                <div className="card-value">{card.value}</div>
                {card.change && (
                  <div className={`card-change ${card.isPositive ? 'positive' : 'negative'}`}>
                    <span className="card-change-icon">{card.isPositive ? '↑' : '↓'}</span>
                    <span>{card.change} Since last month</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="staff-table-section">
            <div className="staff-tabs">
              <div className="staff-tab-group">
                {roles.map((role) => (
                  <button
                    key={role}
                    className={`staff-tab ${activeTab === role ? 'active' : ''}`}
                    onClick={() => setActiveTab(role)}
                  >
                    {role === 'all' ? 'All Staff' : role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="staff-table-container">
              {isLoading ? (
                <div className="loading">Loading staff data...</div>
              ) : error ? (
                <div className="error">{error}</div>
              ) : (
                <table className="staff-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      {isAdmin && <th>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.length > 0 ? (
                      filteredStaff.map(staff => (
                        <tr key={staff.id}>
                          <td>{staff.id}</td>
                          <td>{`${staff.first_name} ${staff.last_name}`}</td>
                          <td>{staff.email}</td>
                          <td>
                            <span className={`role-badge ${staff.role.toLowerCase()}`}>
                              {staff.role}
                            </span>
                          </td>
                          <td>
                            <div className="status-indicator">
                              <div className={`status-dot ${staff.active ? 'positive' : 'negative'}`} />
                              <span>{staff.active ? 'Active' : 'Inactive'}</span>
                            </div>
                          </td>
                          {isAdmin && (
                            <td className="action-buttons">
                              <button 
                                className="edit-btn"
                                onClick={() => navigateToProfile(staff)}
                              >
                                Edit
                              </button>
                              <button 
                                className="delete-btn"
                                onClick={() => handleDeleteEmployee(staff.id)}
                              >
                                Delete
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={isAdmin ? "6" : "5"} className="no-data">No staff members found for this role</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff;