import React, { useState, useEffect } from 'react';
import '../styles/Stock.css';
import SideBar from "../components/SideBar";
import NavigationBar from '../components/NavigationBar';
import { useStock } from '../contexts/StockContext';
import { useAuth } from '../contexts/AuthContext';

const Stock = () => {
  const { stockData, loading, error, fetchStockData, getProductUnit, updateThresholds } = useStock();
  const { isAdmin } = useAuth();
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  
  // New state for threshold editing
  const [showThresholdModal, setShowThresholdModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [lowThreshold, setLowThreshold] = useState('');
  const [highThreshold, setHighThreshold] = useState('');

  useEffect(() => {
    fetchStockData();
  }, []);

  const filteredAndSortedData = () => {
    let result = [...stockData];
    
    if (filterType !== 'all') {
      result = result.filter(item => item.product_type === filterType);
    }
    
    if (showLowStockOnly) {
      result = result.filter(item => item.qte < item.low_threshold);
    }
    
    result.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }
      
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    });
    
    return result;
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Function to open the threshold edit modal
  const openThresholdModal = (item) => {
    setSelectedItem(item);
    setLowThreshold(item.low_threshold.toString());
    setHighThreshold(item.high_threshold.toString());
    setShowThresholdModal(true);
  };

  // Function to close the threshold edit modal
  const closeThresholdModal = () => {
    setShowThresholdModal(false);
    setSelectedItem(null);
  };

  // Function to save the updated thresholds
  const saveThresholds = async () => {
    if (!selectedItem) return;
    
    const low = parseInt(lowThreshold);
    const high = parseInt(highThreshold);
    
    // Basic validation
    if (isNaN(low) || isNaN(high) || low < 1 || high < low) {
      alert('Please enter valid thresholds. Low threshold must be at least 1, and high threshold must be greater than low threshold.');
      return;
    }
    
    try {
      await updateThresholds(selectedItem.id, low, high);
      closeThresholdModal();
    } catch (error) {
      console.error('Failed to update thresholds:', error);
      alert('Failed to update thresholds. Please try again.');
    }
  };

  const productTypes = ['all', ...new Set(stockData.map(item => item.product_type))];

  if (!isAdmin()) {
    return (
      <div>
        <SideBar />
        <NavigationBar />
        <div className="unauthorized-message">
          You don't have permission to view this page.
        </div>
      </div>
    );
  }

  return (
    <div>
      <SideBar />
      <NavigationBar />
      
      <div className="stock-container">
        <div className="stock-header">
          <h2>Stock Management</h2>
        </div>

        {error && <div className="error-message">{error}</div>}
        
        <div className="stock-filters">
          <div className="filter-controls">
            <div className="filter-group">
              <label>Filter by type:</label>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                {productTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-checkbox">
              <input 
                type="checkbox" 
                id="lowStockFilter"
                checked={showLowStockOnly}
                onChange={() => setShowLowStockOnly(!showLowStockOnly)}
              />
              <label htmlFor="lowStockFilter">Show Low Stock Only</label>
            </div>
          </div>
          
          <button 
            className="refresh-button"
            onClick={fetchStockData}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
        
        <div className="stock-table-container">
          <table className="stock-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('id')}>
                  ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('qte')}>
                  Quantity {sortField === 'qte' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('id_product')}>
                  Product ID {sortField === 'id_product' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('product_type')}>
                  Type {sortField === 'product_type' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('qualite')}>
                  Quality {sortField === 'qualite' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('id_manager')}>
                  Manager ID {sortField === 'id_manager' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('date_enter')}>
                  Date Entered {sortField === 'date_enter' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th onClick={() => handleSort('location')}>
                  Location {sortField === 'location' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Status</th>
                <th>Thresholds</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="loading-message">Loading stock data...</td>
                </tr>
              ) : filteredAndSortedData().length > 0 ? (
                filteredAndSortedData().map((item) => {
                  const isCritical = item.qte < (item.low_threshold / 2);
                  const isLow = item.qte < item.low_threshold;
                  const unit = getProductUnit(item.product_type);
                  
                  return (
                    <tr key={item.id} className={isCritical ? 'critical-row' : isLow ? 'low-row' : ''}>
                      <td>{item.id}</td>
                      <td>
                        <div className="quantity-display">
                          <span>{item.qte}</span>
                          <span className="unit">{unit}</span>
                        </div>
                      </td>
                      <td>{item.id_product}</td>
                      <td>{item.product_type}</td>
                      <td>{item.qualite}</td>
                      <td>{item.id_manager || '-'}</td>
                      <td>{new Date(item.date_enter).toLocaleDateString()}</td>
                      <td>{item.location}</td>
                      <td>
                        <span className={`stock-status ${isCritical ? 'critical' : isLow ? 'low' : 'ok'}`}>
                          {isCritical ? 'Critical' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                        {(isLow || isCritical) && (
                          <div className="threshold-info">
                            Threshold: {item.low_threshold} {unit}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="threshold-values">
                          <div>Min: {item.low_threshold} {unit}</div>
                          <div>Max: {item.high_threshold} {unit}</div>
                        </div>
                        <button 
                          className="edit-threshold-button"
                          onClick={() => openThresholdModal(item)}
                        >
                          Edit Thresholds
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="10" className="empty-message">
                    {filterType !== 'all' || showLowStockOnly 
                      ? 'No stock items match the current filters' 
                      : 'No stock items available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Threshold Edit Modal */}
      {showThresholdModal && selectedItem && (
        <div className="threshold-modal-overlay" onClick={closeThresholdModal}>
          <div className="threshold-modal" onClick={e => e.stopPropagation()}>
            <h3>Edit Stock Thresholds</h3>
            <div className="threshold-modal-content">
              <div className="modal-info">
                <div><strong>Product ID:</strong> {selectedItem.id_product}</div>
                <div><strong>Type:</strong> {selectedItem.product_type}</div>
                <div><strong>Current Quantity:</strong> {selectedItem.qte} {getProductUnit(selectedItem.product_type)}</div>
              </div>
              
              <div className="threshold-form">
                <div className="form-group">
                  <label htmlFor="lowThreshold">Low Stock Threshold:</label>
                  <input
                    type="number"
                    id="lowThreshold"
                    value={lowThreshold}
                    onChange={(e) => setLowThreshold(e.target.value)}
                    min="1"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="highThreshold">High Stock Threshold:</label>
                  <input
                    type="number"
                    id="highThreshold"
                    value={highThreshold}
                    onChange={(e) => setHighThreshold(e.target.value)}
                    min={parseInt(lowThreshold) + 1}
                  />
                </div>
              </div>
              
              <div className="modal-buttons">
                <button className="cancel-button" onClick={closeThresholdModal}>Cancel</button>
                <button className="save-button" onClick={saveThresholds}>Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stock;