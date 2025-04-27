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

  // Staff members for admin dashboard
  const staffMembers = [
    { id: 1, name: 'Hadil Benzaid', status: 'active' },
    { id: 2, name: 'Bouchetit Anfel', status: 'active' },
    { id: 3, name: 'Benghorieb Anfel', status: 'inactive' },
  ];

  // Receptionist dashboard data and state
  // Static reservation data for the receptionist view
  const [reservations] = React.useState([
    { id: 1, guest: 'John Doe', checkIn: '2025-04-20', checkOut: '2025-04-25', roomId: 101, state: 'Check-in' },
    { id: 2, guest: 'Jane Smith', checkIn: '2025-04-18', checkOut: '2025-04-23', roomId: 204, state: 'In-house' },
    { id: 3, guest: 'Robert Brown', checkIn: '2025-04-15', checkOut: '2025-04-22', roomId: 305, state: 'Check-out' },
    { id: 4, guest: 'Emily Johnson', checkIn: '2025-04-25', checkOut: '2025-04-30', roomId: 106, state: 'Reserved' },
    { id: 5, guest: 'Michael Wilson', checkIn: '2025-04-22', checkOut: '2025-04-24', roomId: 203, state: 'In-house' },
  ]);
  
  // Sort state for receptionist table
  const [sortField, setSortField] = React.useState('id');
  const [sortDirection, setSortDirection] = React.useState('asc');
  
  // Sort handler for receptionist table
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Sorted reservations for the receptionist view
  const sortedReservations = React.useMemo(() => {
    return [...reservations].sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });
  }, [reservations, sortField, sortDirection]);

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

  return (
    <div className="dashboard">
      <SideBar />
      <NavigationBar />
      
      <div className="dashboard-content">
        {/* Admin Dashboard */}
        {isAdmin() && (
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
        )}

        {/* Receptionist Dashboard */}
        {user.role === 'receptionist' && (
          <>
            <div className="booking-header">
              <h2 className="booking-title">Reservation Management</h2>
            </div>
            
            <div className="booking-table-container">
              <table className="booking-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('id')}>
                      ID {sortField === 'id' && 
                          <span className="booking-sort-icon">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>}
                    </th>
                    <th onClick={() => handleSort('guest')}>
                      Guest {sortField === 'guest' && 
                             <span className="booking-sort-icon">
                               {sortDirection === 'asc' ? '↑' : '↓'}
                             </span>}
                    </th>
                    <th onClick={() => handleSort('checkIn')}>
                      Check-In {sortField === 'checkIn' && 
                                <span className="booking-sort-icon">
                                  {sortDirection === 'asc' ? '↑' : '↓'}
                                </span>}
                    </th>
                    <th onClick={() => handleSort('checkOut')}>
                      Check-Out {sortField === 'checkOut' && 
                                 <span className="booking-sort-icon">
                                   {sortDirection === 'asc' ? '↓' : '↑'}
                                 </span>}
                    </th>
                    <th onClick={() => handleSort('roomId')}>
                      Room ID {sortField === 'roomId' && 
                               <span className="booking-sort-icon">
                                 {sortDirection === 'asc' ? '↑' : '↓'}
                               </span>}
                    </th>
                    <th onClick={() => handleSort('state')}>
                      Status {sortField === 'state' && 
                              <span className="booking-sort-icon">
                                {sortDirection === 'asc' ? '↑' : '↓'}
                              </span>}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReservations.length > 0 ? (
                    sortedReservations.map((reservation) => {
                      // Determine status class based on reservation state
                      let statusClass = '';
                      switch(reservation.state) {
                        case 'Check-in':
                          statusClass = 'booking-status-checkin';
                          break;
                        case 'Check-out':
                          statusClass = 'booking-status-checkout';
                          break;
                        case 'Reserved':
                          statusClass = 'booking-status-reserved';
                          break;
                        case 'In-house':
                          statusClass = 'booking-status-inhouse';
                          break;
                        default:
                          statusClass = 'booking-status-checkin';
                      }
                      
                      return (
                        <tr key={reservation.id}>
                          <td>{reservation.id}</td>
                          <td>{reservation.guest}</td>
                          <td>{reservation.checkIn}</td>
                          <td>{reservation.checkOut}</td>
                          <td>{reservation.roomId}</td>
                          <td>
                            <span className={`booking-status-badge ${statusClass}`}>
                              {reservation.state}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="booking-empty-message">
                        No reservations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="booking-actions">
              <button className="booking-modify-btn">Modify Reservation</button>
              <button className="booking-create-btn">New Reservation</button>
            </div>
          </>
        )}
        
        {/* Unauthorized users */}
        {user && !isAdmin() && user.role !== 'receptionist' && (
          <div className="unauthorized-message">
            You don't have permission to view the dashboard. This area is restricted to administrators and receptionists only.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;