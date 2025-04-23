import React from 'react';
import SideBar from "../components/SideBar";
import NavigationBar from '../components/NavigationBar';
import '../styles/dashboard.css';
import { useAuth } from '../contexts/AuthContext';
import { useStock } from '../contexts/StockContext';
import Calendar from '../components/Calendar.jsx';

const Dashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const { 
    getLowStockItems, 
    getCriticalStockItems,
    loading, 
    error, 
    getProductUnit,
    alertStats 
  } = useStock();
  
  const lowStockItems = getLowStockItems();
  const criticalItems = getCriticalStockItems();

  const staffMembers = [
    { id: 1, name: 'Hadil Benzaid', status: 'active' },
    { id: 2, name: 'Bouchetit Anfel', status: 'active' },
    { id: 3, name: 'Benghorieb Anfel', status: 'inactive' },
  ];

  if (!user) {
    return (
      <div className="dashboard">
        <SideBar />
        <NavigationBar />
        <div className="dashboard-content">
          <div className="unauthorized-message">
            Please log in to view the dashboard.
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin()) {
    return (
      <div className="dashboard">
        <SideBar />
        <NavigationBar />
        <div className="dashboard-content">
          <div className="unauthorized-message">
            You don't have permission to view the admin dashboard. This area is restricted to administrators only.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <SideBar />
      <NavigationBar />
      
      <div className="dashboard-content">
        <div className="dashboard-grid">
          <div className="grid-column">
            <div className="card">
              <h3 className="card-title">Bookings</h3>
              <div className="card-value">36,254</div>
              <div className="card-change positive">
                <span className="card-change-icon">↑</span>
                <span>5.27% Since last month</span>
              </div>
            </div>

            <div className="card">
              <h3 className="card-title">Revenue</h3>
              <div className="card-value">$6,254</div>
              <div className="card-change positive">
                <span className="card-change-icon">↑</span>
                <span>7.00% Since last month</span>
              </div>
            </div>
          </div>

          <div className="grid-column">
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

          <div className="grid-column third-column">
            <div className="schedule-stock-row">
              <div className="card schedule-card">
                <h3 className="card-title">Schedule</h3>
                <div className="calendar-container">
                  <Calendar />
                </div>
              </div>
              
              <div className="card stock-alert-card">
                <h3 className="card-title">Stock Alert</h3>
                {loading ? (
                  <div className="stock-loading">Loading stock data...</div>
                ) : error ? (
                  <div className="stock-error">{error}</div>
                ) : (
                  <>
                    <div className="stock-alert-header">
                      <div className="stock-count">{lowStockItems.length}</div>
                      <div className="stock-label">Items running low</div>
                    </div>
                    
                    <div className="stock-list">
                      {lowStockItems.length === 0 ? (
                        <div className="stock-empty">No items currently below threshold.</div>
                      ) : (
                        <ul className="stock-list-items">
                          {lowStockItems.map(item => {
                            const isCritical = item.qte < (item.low_threshold / 2);
                            const percentFilled = Math.min(100, Math.max(0, (item.qte / item.low_threshold) * 100));
                            const unit = getProductUnit(item.product_type);
                            
                            return (
                              <li key={item.id} className="stock-list-item">
                                <div className="stock-icon">
                                  <span 
                                    className="stock-indicator" 
                                    style={{ backgroundColor: isCritical ? '#ef4444' : '#f59e0b' }}
                                  ></span>
                                </div>
                                <div className="stock-details">
                                  <span className="stock-name">
                                    {/* Product ID and type */}
                                    {item.product_type} (ID: {item.id_product})
                                  </span>
                                  <div className="stock-level">
                                    <div className="stock-progress-bar">
                                      <div 
                                        className="stock-progress" 
                                        style={{ 
                                          width: `${percentFilled}%`,
                                          backgroundColor: isCritical ? '#ef4444' : '#f59e0b' 
                                        }}
                                      ></div>
                                    </div>
                                    <span className="stock-numbers">
                                      {item.qte}/{item.low_threshold} {unit}
                                    </span>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                    
                    <div className="stock-footer">
                      <button 
                        className="stock-report-btn"
                        onClick={() => window.location.href = '/stock'}
                      >
                        Manage Stock
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;