import React from 'react';
import SideBar from "../components/SideBar";
import NavigationBar from '../components/NavigationBar';
import '../styles/dashboard.css';
import { useAuth } from '../contexts/AuthContext';
import { useStock } from '../contexts/StockContext';
import Calendar from '../components/Calendar.jsx';
const Dashboard = () => {
  const { user, logout } = useAuth();
  const { getLowStockItems } = useStock();
  
  const lowStockItems = getLowStockItems();

  const staffMembers = [
    { id: 1, name: 'Hadil Benzaid', status: 'active' },
    { id: 2, name: 'Bouchetit Anfel', status: 'active' },
    { id: 3, name: 'Benghorieb Anfel', status: 'inactive' },
  ];

  return (
    <div className="dashboard">
      <SideBar />
      <NavigationBar />
      
      <div className="dashboard-content">
        <div className="dashboard-grid">
          {/* Bookings & Revenue Cards */}
          <div className="grid-column">
            {/* Bookings Card */}
            <div className="card">
              <h3 className="card-title">Bookings</h3>
              <div className="card-value">36,254</div>
              <div className="card-change positive">
                <span className="card-change-icon">↑</span>
                <span>5.27% Since last month</span>
              </div>
            </div>

            {/* Revenue Card */}
            <div className="card">
              <h3 className="card-title">Revenue</h3>
              <div className="card-value">$6,254</div>
              <div className="card-change positive">
                <span className="card-change-icon">↑</span>
                <span>7.00% Since last month</span>
              </div>
            </div>
          </div>

          {/* Second Column - Combined Staff Card & Staff List */}
          <div className="grid-column">
            {/* Combined Staff Card with List */}
            <div className="card staff-combined-card">
              <div className="staff-header">
                <div className="staff-metrics">
                  <h3 className="card-title">Staff</h3>
                  <div className="card-value">43</div>
                </div>
              </div>
              
              <h3 className="card-title staff-list-title">Staff List</h3>
              <div className="staff-list">
                <ul className="staff-list-items">
                  {staffMembers.map(staff => (
                    <li key={staff.id} className="staff-list-item">
                      <div className="staff-avatar">
                        {staff.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="staff-name">{staff.name}</span>
                      <span className={`staff-status ${staff.status}`}>
                        {staff.status === 'active' ? 'Online' : 'Offline'}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Third Column - Schedule & Stock Alert side by side */}
          <div className="grid-column third-column">
            <div className="schedule-stock-row">
              {/* Schedule Card */}
              <div className="card schedule-card">
                <h3 className="card-title">Schedule</h3>
                <div className="calendar-container">
                  <Calendar />
                </div>
              </div>
              
              {/* Stock Alert Card */}
              <div className="card stock-alert-card">
                <h3 className="card-title">Stock Alert</h3>
                <div className="stock-alert-header">
                  <div className="stock-count">{lowStockItems.length}</div>
                  <div className="stock-label">Items running low</div>
                </div>
                
                <div className="stock-list">
                  <ul className="stock-list-items">
                    {lowStockItems.map(item => (
                      <li key={item.id} className="stock-list-item">
                        <div className="stock-icon">
                          <span className="stock-indicator" style={{ 
                            backgroundColor: item.qte < item.threshold / 2 ? '#ef4444' : '#f59e0b' 
                          }}></span>
                        </div>
                        <div className="stock-details">
                          <span className="stock-name">{item.product_type}</span>
                          <div className="stock-level">
                            <div className="stock-progress-bar">
                              <div 
                                className="stock-progress" 
                                style={{ width: `${(item.qte / item.threshold) * 100}%` }}
                              ></div>
                            </div>
                            <span className="stock-numbers">
                              {item.qte}/{item.threshold} {item.unit || 'units'}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="stock-footer">
                  <button className="stock-report-btn">Report</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;