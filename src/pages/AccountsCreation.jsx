import React, { useState, useEffect } from 'react';
import SideBar from "../components/SideBar";
import NavigationBar from '../components/NavigationBar';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import '../styles/accounts-creation.css';
import { User, Mail, MapPin, CreditCard, UserCheck, Calendar, Lock, Users } from 'lucide-react';

const AccountsCreation = () => {
  const { user, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    Email: '',
    Adresse: '',
    ccp: '',
    Role: '',
    hire_date: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recentAccounts, setRecentAccounts] = useState([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [newlyCreatedAccounts, setNewlyCreatedAccounts] = useState([]);

  // Fetch recent accounts on component mount
  useEffect(() => {
    if (user && isAdmin()) {
      fetchRecentAccounts();
    }
  }, [user]);

  const fetchRecentAccounts = async () => {
    setIsLoadingAccounts(true);
    try {
      const response = await axios.get('/api/Admin/Accounts/Recent', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      
      let fetchedAccounts = [];
      
      if (response.data && response.data.employees) {
        fetchedAccounts = response.data.employees.sort((a, b) => 
          new Date(b.created_at || b.hire_date) - new Date(a.created_at || a.hire_date)
        );
      } else {
        fetchedAccounts = [
          { id: 4, first_name: 'Sara', last_name: 'Wilson', Email: 'sara.w@example.com', Role: 'housekeeper', hire_date: '2025-04-05', created_at: '2025-04-05' },
          { id: 3, first_name: 'Mike', last_name: 'Johnson', Email: 'mike.j@example.com', Role: 'receptionist', hire_date: '2025-03-10', created_at: '2025-03-10' },
          { id: 2, first_name: 'Jane', last_name: 'Smith', Email: 'jane.smith@example.com', Role: 'manager', hire_date: '2025-02-20', created_at: '2025-02-20' },
          { id: 1, first_name: 'John', last_name: 'Doe', Email: 'john.doe@example.com', Role: 'admin', hire_date: '2025-01-15', created_at: '2025-01-15' }
        ];
      }
      
    
      const existingEmails = newlyCreatedAccounts.map(acc => acc.Email);
      const filteredFetched = fetchedAccounts.filter(acc => !existingEmails.includes(acc.Email));
      
      setRecentAccounts([...newlyCreatedAccounts, ...filteredFetched]);
    } catch (error) {
      console.error('Error fetching recent accounts:', error);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    
    if (!formData.Email.trim()) {
      newErrors.Email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      newErrors.Email = 'Email is invalid';
    }
    
    if (!formData.Adresse.trim()) newErrors.Adresse = 'Address is required';
    if (!formData.ccp.trim()) newErrors.ccp = 'CCP is required';
    if (!formData.Role.trim()) newErrors.Role = 'Role is required';
    
    if (!formData.hire_date) {
      newErrors.hire_date = 'Hire date is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setSuccessMessage('');
    setErrors({});
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Sending data:', formData);
      const response = await axios.post('/api/Admin/CreateAccount', formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        }
      });
      console.log('Response:', response);
      
      setSuccessMessage('Employee account created successfully!');
      
      const tempId = Date.now();
      const currentDate = new Date().toISOString().split('T')[0];
      
      const newAccount = {
        id: response.data?.id || tempId,
        first_name: formData.first_name,
        last_name: formData.last_name,
        Email: formData.Email,
        Role: formData.Role,
        hire_date: formData.hire_date,
        created_at: currentDate
      };
      
      setNewlyCreatedAccounts(prev => [newAccount, ...prev]);
      
      setRecentAccounts(prevAccounts => [newAccount, ...prevAccounts]);
      
      setFormData({
        first_name: '',
        last_name: '',
        Email: '',
        Adresse: '',
        ccp: '',
        Role: '',
        hire_date: '',
        password: ''
      });
      
      
    } catch (error) {
      console.error('Error creating employee account:', error);
      
      if (error.response) {
        console.error('Error response data:', error.response.data);
        
        // Handle Laravel validation errors
        if (error.response.data.errors) {
          setErrors(error.response.data.errors);
        } 
        // Handle unique constraint violation
        else if (error.response.status === 500 && 
                error.response.data.message && 
                error.response.data.message.includes('Integrity constraint violation')) {
          setErrors({
            Email: 'This email address is already in use by another employee'
          });
        } else {
          setErrors({
            general: error.response.data.message || 'Failed to create employee account. Please try again.'
          });
        }
      } else {
        setErrors({
          general: 'Network error. Please check your connection and try again.'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'role-badge admin';
      case 'manager':
        return 'role-badge manager';
      case 'receptionist':
        return 'role-badge receptionist';
      case 'housekeeper':
        return 'role-badge housekeeper';
      default:
        return 'role-badge';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!user) {
    return (
      <div className="accounts-creation">
        <SideBar />
        <NavigationBar />
        <div className="accounts-creation-content">
          <div className="unauthorized-message">
            Please log in to access this page.
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className="accounts-creation">
        <SideBar />
        <NavigationBar />
        <div className="accounts-creation-content">
          <div className="unauthorized-message">
            You don't have permission to create employee accounts. This area is restricted to administrators only.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="accounts-creation">
      <SideBar />
      <NavigationBar />
      
      <div className="accounts-creation-content">
        <h2 className="page-title">Employee Accounts Management</h2>
        
        <div className="accounts-creation-layout">
          {/* Recent Accounts Section */}
          <div className="recent-accounts-section">
            <div className="accounts-list-card">
              <div className="card-header">
                <h2 className="card-title">
                  <Users size={20} />
                  Latest Created Accounts
                </h2>
              </div>
              
              {isLoadingAccounts ? (
                <div className="loading-indicator">
                  <div className="spinner"></div>
                  <p>Loading accounts...</p>
                </div>
              ) : recentAccounts.length > 0 ? (
                <div className="accounts-list">
                  {recentAccounts.map((account, index) => (
                    <div key={account.id || index} className="account-item">
                      <div className="account-avatar">
                        {account.first_name.charAt(0)}{account.last_name.charAt(0)}
                      </div>
                      <div className="account-details">
                        <h3>{account.first_name} {account.last_name}</h3>
                        <p className="account-email">
                          <Mail size={14} />
                          {account.Email}
                        </p>
                        <div className="account-meta">
                          <span className={getRoleBadgeClass(account.Role)}>
                            {account.Role}
                          </span>
                          <span className="hire-date">
                            <Calendar size={14} />
                            {formatDate(account.hire_date)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-accounts-message">
                  <p>No employee accounts found.</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Create Account Form Section */}
          <div className="create-account-section">
            <div className="accounts-creation-card">
              <h2 className="card-title">Create Employee Account</h2>
              
              {successMessage && (
                <div className="success-message">
                  {successMessage}
                </div>
              )}
              
              {errors.general && (
                <div className="error-message">
                  {errors.general}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="accounts-creation-form">
                <div className="details-section">
                  <h3 className="section-title">Personal Information</h3>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>
                        <User size={16} />
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        className={errors.first_name ? 'input-error' : ''}
                      />
                      {errors.first_name && <div className="error-text">{errors.first_name}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <User size={16} />
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        className={errors.last_name ? 'input-error' : ''}
                      />
                      {errors.last_name && <div className="error-text">{errors.last_name}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <Mail size={16} />
                        Email
                      </label>
                      <input
                        type="email"
                        id="Email"
                        name="Email"
                        value={formData.Email}
                        onChange={handleChange}
                        className={errors.Email ? 'input-error' : ''}
                      />
                      {errors.Email && <div className="error-text">{errors.Email}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <MapPin size={16} />
                        Address
                      </label>
                      <input
                        type="text"
                        id="Adresse"
                        name="Adresse"
                        value={formData.Adresse}
                        onChange={handleChange}
                        className={errors.Adresse ? 'input-error' : ''}
                      />
                      {errors.Adresse && <div className="error-text">{errors.Adresse}</div>}
                    </div>
                  </div>
                </div>

                <div className="details-section">
                  <h3 className="section-title">Employment Details</h3>
                  
                  <div className="form-grid">
                    <div className="form-group">
                      <label>
                        <CreditCard size={16} />
                        CCP
                      </label>
                      <input
                        type="text"
                        id="ccp"
                        name="ccp"
                        value={formData.ccp}
                        onChange={handleChange}
                        className={errors.ccp ? 'input-error' : ''}
                      />
                      {errors.ccp && <div className="error-text">{errors.ccp}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <UserCheck size={16} />
                        Role
                      </label>
                      <select
                        id="Role"
                        name="Role"
                        value={formData.Role}
                        onChange={handleChange}
                        className={errors.Role ? 'input-error' : ''}
                      >
                        <option value="">Select a role</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="housekeeper">Housekeeper</option>
                        <option value="receptionist">Receptionist</option>
                      </select>
                      {errors.Role && <div className="error-text">{errors.Role}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <Calendar size={16} />
                        Hire Date
                      </label>
                      <input
                        type="date"
                        id="hire_date"
                        name="hire_date"
                        value={formData.hire_date}
                        onChange={handleChange}
                        className={errors.hire_date ? 'input-error' : ''}
                      />
                      {errors.hire_date && <div className="error-text">{errors.hire_date}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label>
                        <Lock size={16} />
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? 'input-error' : ''}
                      />
                      {errors.password && <div className="error-text">{errors.password}</div>}
                    </div>
                  </div>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="submit" 
                    className="create-button"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountsCreation;