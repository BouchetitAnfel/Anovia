import React from 'react';
import SideBar from "../components/SideBar";
import NavigationBar from '../components/NavigationBar';
import '../styles/dashboard.css';
import { useAuth } from '../contexts/AuthContext';
import { useStock } from '../contexts/StockContext';
import Calendar from '../components/Calendar.jsx';
import { useNavigate } from 'react-router-dom';

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
  
  const navigate = useNavigate();
  
  const lowStockItems = getLowStockItems();
  const criticalItems = getCriticalStockItems();

  const staffMembers = [
    { id: 1, name: 'Hadil Benzaid', status: 'active' },
    { id: 2, name: 'Bouchetit Anfel', status: 'active' },
    { id: 3, name: 'Benghorieb Anfel', status: 'inactive' },
  ];

  
  const [reservations] = React.useState([
    { id: 1, guest: 'John Doe', checkIn: '2025-04-20', checkOut: '2025-04-25', roomId: 101, state: 'Check-in' },
    { id: 2, guest: 'Jane Smith', checkIn: '2025-04-18', checkOut: '2025-04-23', roomId: 204, state: 'In-house' },
    { id: 3, guest: 'Robert Brown', checkIn: '2025-04-15', checkOut: '2025-04-22', roomId: 305, state: 'Check-out' },
    { id: 4, guest: 'Emily Johnson', checkIn: '2025-04-25', checkOut: '2025-04-30', roomId: 106, state: 'Reserved' },
    { id: 5, guest: 'Michael Wilson', checkIn: '2025-04-22', checkOut: '2025-04-24', roomId: 203, state: 'In-house' },
  ]);
  
  const [sortField, setSortField] = React.useState('id');
  const [sortDirection, setSortDirection] = React.useState('asc');
  
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleNewReservation = () => {
    navigate('/reservation');
  };
  
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
  
  const [rooms, setRooms] = React.useState([
    { id: 101, type: 'Standard', status: 'Dirty', team: 'Team A', floor: 1, lastCleaned: '2025-04-28' },
    { id: 102, type: 'Deluxe', status: 'Clean', team: 'Team A', floor: 1, lastCleaned: '2025-05-01' },
    { id: 103, type: 'Suite', status: 'Out of Order', team: 'Team B', floor: 1, lastCleaned: '2025-04-25' },
    { id: 201, type: 'Standard', status: 'Clean', team: 'Team B', floor: 2, lastCleaned: '2025-05-01' },
    { id: 202, type: 'Standard', status: 'Dirty', team: 'Team A', floor: 2, lastCleaned: '2025-04-27' },
    { id: 203, type: 'Suite', status: 'Clean', team: 'Team C', floor: 2, lastCleaned: '2025-05-02' },
    { id: 301, type: 'Deluxe', status: 'Out of Order', team: 'Team C', floor: 3, lastCleaned: '2025-04-20' },
    { id: 302, type: 'Standard', status: 'Dirty', team: 'Team B', floor: 3, lastCleaned: '2025-04-30' },
    { id: 303, type: 'Suite', status: 'Dirty', team: 'Team A', floor: 3, lastCleaned: '2025-04-29' },
  ]);
  
  const [expandedRoom, setExpandedRoom] = React.useState(null);
  const [filterTeam, setFilterTeam] = React.useState('All Teams');
  const [filterStatus, setFilterStatus] = React.useState('All Status');
  const [filterFloor, setFilterFloor] = React.useState('All Floors');
  
  const toggleRoomExpand = (roomId) => {
    setExpandedRoom(expandedRoom === roomId ? null : roomId);
  };
  
  const updateRoomStatus = (roomId, newStatus) => {
    console.log(`Updated room ${roomId} status to ${newStatus}`);
    
    setRooms(rooms.map(room => 
      room.id === roomId ? { 
        ...room, 
        status: newStatus, 
        lastCleaned: newStatus === 'Clean' ? '2025-05-02' : room.lastCleaned 
      } : room
    ));
  };
  
  const filteredRooms = React.useMemo(() => {
    return rooms.filter(room => {
      const teamMatch = filterTeam === 'All Teams' || room.team === filterTeam;
      const statusMatch = filterStatus === 'All Status' || room.status === filterStatus;
      const floorMatch = filterFloor === 'All Floors' || room.floor === parseInt(filterFloor);
      return teamMatch && statusMatch && floorMatch;
    });
  }, [rooms, filterTeam, filterStatus, filterFloor]);
  
  const teams = ['All Teams', ...new Set(rooms.map(room => room.team))];
  const statuses = ['All Status', 'Clean', 'Dirty', 'Out of Order'];
  const floors = ['All Floors', ...new Set(rooms.map(room => room.floor))];
  
  const roomStatusCounts = React.useMemo(() => {
    const counts = { Clean: 0, Dirty: 0, 'Out of Order': 0 };
    filteredRooms.forEach(room => {
      if (counts[room.status] !== undefined) {
        counts[room.status]++;
      }
    });
    return counts;
  }, [filteredRooms]);

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
                          onClick={() => navigate('/stock')}
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
                    <th onClick={() => handleSort('id')}>ID</th>
                    <th onClick={() => handleSort('guest')}>Guest</th>
                    <th onClick={() => handleSort('checkIn')}>Check-In</th>
                    <th onClick={() => handleSort('checkOut')}>Check-Out</th>
                    <th onClick={() => handleSort('roomId')}>Room ID</th>
                    <th onClick={() => handleSort('state')}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedReservations.length > 0 ? (
                    sortedReservations.map((reservation) => {
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
              <button className="booking-create-btn" onClick={handleNewReservation}>New Reservation</button>
            </div>
          </>
        )}
        
        {/* Housekeeper Dashboard */}
        {user.role === 'housekeeper' && (
          <>
            <div className="rooms-header">
            <h2 className="rooms-title">Housekeeping Management</h2>
              <div className="housekeeper-filters">
                <select 
                  className="housekeeper-filter" 
                  value={filterTeam} 
                  onChange={(e) => setFilterTeam(e.target.value)}
                >
                  {teams.map(team => (
                    <option key={team} value={team}>{team}</option>
                  ))}
                </select>
                <select 
                  className="housekeeper-filter" 
                  value={filterStatus} 
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <select 
                  className="housekeeper-filter" 
                  value={filterFloor} 
                  onChange={(e) => setFilterFloor(e.target.value)}
                >
                  {floors.map(floor => (
                    <option key={floor} value={floor}>
                      {floor === 'All Floors' ? floor : `Floor ${floor}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          
            <div className="housekeeper-stats">
              <div className="housekeeper-stat-card">
                <div className="housekeeper-stat-value">{roomStatusCounts.Clean}</div>
                <div className="housekeeper-stat-label">Clean</div>
              </div>
              <div className="housekeeper-stat-card">
                <div className="housekeeper-stat-value">{roomStatusCounts.Dirty}</div>
                <div className="housekeeper-stat-label">Dirty</div>
              </div>
              <div className="housekeeper-stat-card">
                <div className="housekeeper-stat-value">{roomStatusCounts['Out of Order']}</div>
                <div className="housekeeper-stat-label">Out of Order</div>
              </div>
            </div>
            
            <div className="rooms-table-container">
              <table className="rooms-table">
                <thead>
                  <tr>
                    <th className="room-header">Room</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Team</th>
                    <th>Floor</th>
                    <th>Last Cleaned</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map(room => {
                    const isExpanded = expandedRoom === room.id;
                    
                    // Determine status styling
                    let statusClass = '';
                    if (room.status === 'Clean') {
                      statusClass = 'room-status-indicator';
                    } else if (room.status === 'Dirty') {
                      statusClass = 'room-status-indicator';
                    } else if (room.status === 'Out of Order') {
                      statusClass = 'room-status-indicator';
                    }
                    
                    return (
                      <React.Fragment key={room.id}>
                        <tr 
                          className={`room-row ${isExpanded ? 'expanded' : ''}`}
                          onClick={() => toggleRoomExpand(room.id)}
                        >
                          <td>
                            <div className="room-id-container">
                              <span className="room-number">{room.id}</span>
                            </div>
                          </td>
                          <td>{room.type}</td>
                          <td className="room-status-cell">
                            <div 
                              className={statusClass} 
                              title={room.status}
                            >
                              <span className="status-label">{room.status}</span>
                            </div>
                          </td>
                          <td>{room.team}</td>
                          <td>Floor {room.floor}</td>
                          <td>{room.lastCleaned}</td>
                        </tr>
                        
                        {isExpanded && (
                          <tr className="room-details-row">
                            <td colSpan="6">
                              <div className="room-details">
                                <div className="room-info">
                                  <div className="info-group">
                                    <span className="info-label">Room Number</span>
                                    <span className="info-value">{room.id}</span>
                                  </div>
                                  <div className="info-group">
                                    <span className="info-label">Room Type</span>
                                    <span className="info-value">{room.type}</span>
                                  </div>
                                  <div className="info-group">
                                    <span className="info-label">Current Status</span>
                                    <span className="info-value">{room.status}</span>
                                  </div>
                                  <div className="info-group">
                                    <span className="info-label">Assigned Team</span>
                                    <span className="info-value">{room.team}</span>
                                  </div>
                                  <div className="info-group">
                                    <span className="info-label">Last Cleaned</span>
                                    <span className="info-value">{room.lastCleaned}</span>
                                  </div>
                                </div>
                                <div className="room-actions">
                                  <h4 className="room-actions-title">Update Room Status</h4>
  
                                  <div className="status-buttons-container">
                                    <div className="status-button-row">
                                      <button 
                                         className="status-change-btn" 
                                        style={{ backgroundColor: '#d1f2d1', color: '#10b981' }}
                                        onClick={() => updateRoomStatus(room.id, 'Clean')}
                                      >
                                        Clean
                                      </button>
                                      <button 
                                        className="status-change-btn" 
                                        style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}
                                        onClick={() => updateRoomStatus(room.id, 'Dirty')}
                                      >
                                        Dirty
                                      </button>
                                      <button 
                                        className="status-change-btn" 
                                        style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
                                        onClick={() => updateRoomStatus(room.id, 'Out of Order')}
                                      >
                                        Out of Order
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            <div className="rooms-legend">
              <h4 className="legend-title">Status Legend</h4>
              <div className="legend-items">
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#d1f2d1' }}></div>
                  <span className="legend-label">Clean</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#dda3a3' }}></div>
                  <span className="legend-label">Dirty</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#f3f4f6' }}></div>
                  <span className="legend-label">Out of Order</span>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Unauthorized users */}
        {user && !isAdmin() && user.role !== 'receptionist' && user.role !== 'housekeeper' && (
          <div className="unauthorized-message">
            You don't have permission to view the dashboard. This area is restricted to administrators, receptionists, and housekeepers only.
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;