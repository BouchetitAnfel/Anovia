import React, { useState, useEffect } from 'react';
import SideBar from "../components/SideBar";
import NavigationBar from '../components/NavigationBar';
import '../styles/Rooms.css';
import { useAuth } from '../contexts/AuthContext';

const Rooms = () => {
  const { user, isAdmin } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [visibleDates, setVisibleDates] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [expandedRoom, setExpandedRoom] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const roomStatuses = {
    'available': { color: '#d1f2d1', label: 'Available' },   
    'clean': { color: '#45ad7e', label: 'Clean' },            
    'dirty': { color: '#dda3a3', label: 'Dirty' },          
    'reserved': { color: '#d1e9ff', label: 'Reserved' },    
    'occupied': { color: '#fee2e2', label: 'Occupied' },      
    'outOfOrder': { color: '#e4e7eb', label: 'Out of Order' },
    'lateCheckout': { color: '#ffe2bc', label: 'Late Checkout' }, 
    'doNotDisturb': { color: '#fbd2e7', label: 'Do Not Disturb' },
    'stayover': { color: '#bfa4fa', label: 'Stayover' }      
  };
  useEffect(() => {
    const dates = [];
    const startDate = new Date(currentDate);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }
    
    setVisibleDates(dates);
    // Initialize selected date to today
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, [currentDate]);

  useEffect(() => {
    const sampleRooms = Array.from({ length: 15 }, (_, i) => {
      const roomId = 100 + i;
      const floor = Math.floor(roomId / 100);
      const roomType = i % 3 === 0 ? 'Suite' : i % 3 === 1 ? 'Double' : 'Single';
      const capacity = i % 3 === 0 ? 4 : i % 3 === 1 ? 2 : 1;
      
      const statusByDate = {};
      visibleDates.forEach(date => {
        const statuses = Object.keys(roomStatuses);
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        statusByDate[date.toISOString().split('T')[0]] = randomStatus;
      });
      
      return {
        id: roomId,
        floor: floor,
        type: roomType,
        capacity: capacity,
        statusByDate: statusByDate
      };
    });
    
    setRooms(sampleRooms);
  }, [visibleDates]);

  const previousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const resetToToday = () => {
    setCurrentDate(new Date());
  };

  const toggleRoomDetails = (roomId) => {
    if (expandedRoom === roomId) {
      setExpandedRoom(null);
    } else {
      setExpandedRoom(roomId);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const handleStatusChange = (roomId, date, newStatus, e) => {
    if (e) {
      e.stopPropagation(); 
    }
    
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          statusByDate: {
            ...room.statusByDate,
            [date]: newStatus
          }
        };
      }
      return room;
    }));
  };

  if (!user) {
    return (
      <div className="rooms">
        <SideBar />
        <NavigationBar />
        <div className="rooms-content">
          <div className="unauthorized-message">
            Please log in to view the room status board.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rooms">
      <SideBar />
      <NavigationBar />
      
      <div className="rooms-content">
        {(isAdmin() || user.role === 'receptionist') ? (
          <>
            <div className="rooms-header">
              <h2 className="rooms-title">Room Status Board</h2>
              <div className="date-navigation">
                <button onClick={previousWeek} className="date-nav-btn">
                  ←Previous
                </button>
                <button onClick={resetToToday} className="date-reset-btn">
                  Today
                </button>
                <button onClick={nextWeek} className="date-nav-btn">
                  Next→
                </button>
              </div>
            </div>
            
            <div className="rooms-table-container">
              <table className="rooms-table">
                <thead>
                  <tr>
                    <th className="room-header">Room ID</th>
                    {visibleDates.map((date) => (
                      <th key={date.toISOString()} className="date-header">
                        {formatDate(date)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <React.Fragment key={room.id}>
                      <tr 
                        className={`room-row ${expandedRoom === room.id ? 'expanded' : ''}`}
                        onClick={() => toggleRoomDetails(room.id)}
                      >
                        <td className="room-id">
                          <div className="room-id-container">
                            <span className="room-number">{room.id}</span>
                            <span className="room-type">{room.type}</span>
                          </div>
                        </td>
                        
                        {visibleDates.map((date) => {
                          const dateKey = date.toISOString().split('T')[0];
                          const status = room.statusByDate[dateKey];
                          const statusInfo = roomStatuses[status];
                          
                          return (
                            <td 
                              key={`${room.id}-${dateKey}`} 
                              className="room-status-cell"
                            >
                              <div 
                                className="room-status-indicator" 
                                style={{ backgroundColor: statusInfo.color }}
                                title={statusInfo.label}
                              >
                                <span className="status-label">{statusInfo.label}</span>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                      
                      {expandedRoom === room.id && (
                        <tr className="room-details-row">
                          <td colSpan={visibleDates.length + 1}>
                            <div className="room-details">
                              <div className="room-info">
                                <div className="info-group">
                                  <span className="info-label">Room:</span>
                                  <span className="info-value">{room.id}</span>
                                </div>
                                <div className="info-group">
                                  <span className="info-label">Type:</span>
                                  <span className="info-value">{room.type}</span>
                                </div>
                                <div className="info-group">
                                  <span className="info-label">Floor:</span>
                                  <span className="info-value">{room.floor}</span>
                                </div>
                                <div className="info-group">
                                  <span className="info-label">Capacity:</span>
                                  <span className="info-value">{room.capacity}</span>
                                </div>
                              </div>
                              
                              <div className="room-actions">
                                <h4>Change Status</h4>
                                <div className="status-date-select">
                                  <span>Change status for:</span>
                                  <select 
                                    value={selectedDate || ''}
                                    onClick={(e) => e.stopPropagation()}
                                    onChange={(e) => {
                                      e.stopPropagation();
                                      setSelectedDate(e.target.value);
                                    }}
                                  >
                                    {visibleDates.map((date) => (
                                      <option key={date.toISOString()} value={date.toISOString().split('T')[0]}>
                                        {formatDate(date)}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                
                                {/* Two-row status button layout */}
                                <div className="status-buttons-container">
                                  {/* First row of status buttons */}
                                  <div className="status-button-row"> <button
                                    className="status-change-btn"
                                    style={{ 
                                      backgroundColor: roomStatuses['available'].color,
                                      color: '#10b981' 
                                    }}
                                    onClick={(e) => handleStatusChange(room.id, selectedDate, 'available', e)}
                                  >
                                    Available
                                </button>    
                                    <button
                                      className="status-change-btn"
                                      style={{ 
                                        backgroundColor: roomStatuses['clean'].color,
                                        color: '#000'
                                      }}
                                      onClick={(e) => handleStatusChange(room.id, selectedDate, 'clean', e)}
                                    >
                                      Clean
                                    </button>
                                    <button
                                      className="status-change-btn"
                                      style={{ 
                                        backgroundColor: roomStatuses['dirty'].color,
                                        color: '#fff'
                                      }}
                                      onClick={(e) => handleStatusChange(room.id, selectedDate, 'dirty', e)}
                                    >
                                      Dirty
                                    </button>
                                    <button
                                      className="status-change-btn"
                                      style={{ 
                                        backgroundColor: roomStatuses['reserved'].color,
                                        color: '#fff'
                                      }}
                                      onClick={(e) => handleStatusChange(room.id, selectedDate, 'reserved', e)}
                                    >
                                      Reserved
                                    </button>
                                  </div>
                                  
                                  {/* Second row of status buttons */}
                                  <div className="status-button-row">
                                    <button
                                      className="status-change-btn"
                                      style={{ 
                                        backgroundColor: roomStatuses['occupied'].color,
                                        color: '#ef4444'
                                      }}
                                      onClick={(e) => handleStatusChange(room.id, selectedDate, 'occupied', e)}
                                    >
                                      Occupied
                                    </button>
                                    <button
                                      className="status-change-btn"
                                      style={{ 
                                        backgroundColor: roomStatuses['outOfOrder'].color,
                                        color: '#6b7280'
                                      }}
                                      onClick={(e) => handleStatusChange(room.id, selectedDate, 'outOfOrder', e)}
                                    >
                                      Out of Order
                                    </button>
                                    <button
                                      className="status-change-btn"
                                      style={{ 
                                        backgroundColor: roomStatuses['lateCheckout'].color,
                                        color: '#000'
                                      }}
                                      onClick={(e) => handleStatusChange(room.id, selectedDate, 'lateCheckout', e)}
                                    >
                                      Late Checkout
                                    </button>
                                    <button
                                      className="status-change-btn"
                                      style={{ 
                                        backgroundColor: roomStatuses['doNotDisturb'].color,
                                        color: '#fff'
                                      }}
                                      onClick={(e) => handleStatusChange(room.id, selectedDate, 'doNotDisturb', e)}
                                    >
                                      Do Not Disturb
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="rooms-legend">
              <h4 className="legend-title">Status Legend</h4>
              <div className="legend-items">
                {Object.entries(roomStatuses).map(([key, value]) => (
                  <div key={key} className="legend-item">
                    <div 
                      className="legend-color" 
                      style={{ backgroundColor: value.color }}
                    ></div>
                    <span className="legend-label">{value.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="unauthorized-message">
            You don't have permission to view the room status board. This area is restricted to administrators and receptionists only.
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;