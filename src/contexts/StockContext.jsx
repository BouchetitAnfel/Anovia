// src/contexts/StockContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const StockContext = createContext();

export const useStock = () => useContext(StockContext);

export const StockProvider = ({ children }) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alertStats, setAlertStats] = useState({
    lowCount: 0,
    criticalCount: 0
  });

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Admin/Stock/List');
      
      // Format the stock data to ensure it has all needed properties
      const formattedData = response.data.map(item => ({
        ...item,
        // Use the provided thresholds or calculate based on product type
        low_threshold: item.low_threshold || getDefaultThreshold(item.product_type).low,
        high_threshold: item.high_threshold || getDefaultThreshold(item.product_type).high
      }));

      setStockData(formattedData);
      
      // Update alert statistics
      const lowItems = formattedData.filter(item => item.qte < item.low_threshold);
      const criticalItems = formattedData.filter(item => item.qte < (item.low_threshold / 2));
      
      setAlertStats({
        lowCount: lowItems.length,
        criticalCount: criticalItems.length
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to load stock data. Please try again later.');
      // For development without backend, use sample data
      const sampleData = [
        { id: 1, qte: 5, id_product: 101, product_type: 'furniture', qualite: 'Good', id_manager: 1, date_enter: '2025-01-15', location: 'Warehouse A', low_threshold: 10, high_threshold: 50 },
        { id: 2, qte: 12, id_product: 102, product_type: 'supplies', qualite: 'Excellent', id_manager: 2, date_enter: '2025-02-01', location: 'Warehouse B', low_threshold: 20, high_threshold: 200 },
        { id: 3, qte: 8, id_product: 103, product_type: 'supplies', qualite: 'Good', id_manager: 1, date_enter: '2025-03-10', location: 'Warehouse A', low_threshold: 20, high_threshold: 200 },
        { id: 4, qte: 7, id_product: 104, product_type: 'furniture', qualite: 'Fair', id_manager: 3, date_enter: '2025-01-20', location: 'Warehouse C', low_threshold: 15, high_threshold: 50 },
        { id: 5, qte: 4, id_product: 105, product_type: 'electronics', qualite: 'Good', id_manager: 2, date_enter: '2025-02-25', location: 'Warehouse B', low_threshold: 15, high_threshold: 75 },
        { id: 6, qte: 25, id_product: 106, product_type: 'furniture', qualite: 'Excellent', id_manager: 1, date_enter: '2025-03-05', location: 'Warehouse A', low_threshold: 15, high_threshold: 50 },
        { id: 7, qte: 3, id_product: 107, product_type: 'electronics', qualite: 'Good', id_manager: 3, date_enter: '2025-01-10', location: 'Warehouse C', low_threshold: 15, high_threshold: 75 },
      ];
      
      setStockData(sampleData);
      
      // Update alert statistics for sample data
      const lowItems = sampleData.filter(item => item.qte < item.low_threshold);
      const criticalItems = sampleData.filter(item => item.qte < (item.low_threshold / 2));
      
      setAlertStats({
        lowCount: lowItems.length,
        criticalCount: criticalItems.length
      });
    } finally {
      setLoading(false);
    }
  };

  // Get default thresholds based on product type (matching backend logic)
  const getDefaultThreshold = (productType) => {
    const thresholds = {
      'furniture': { low: 5, high: 50 },
      'electronics': { low: 15, high: 75 },
      'supplies': { low: 20, high: 200 },
    };

    return thresholds[productType] || { low: 10, high: 100 }; // Defaults from StockManagementController
  };

  // Get low stock items (items where quantity is below threshold)
  const getLowStockItems = () => {
    return stockData.filter(item => item.qte < item.low_threshold);
  };

  // Get critically low stock items (items where quantity is below half of threshold)
  const getCriticalStockItems = () => {
    return stockData.filter(item => item.qte < (item.low_threshold / 2));
  };

  // Function to get unit based on product type
  const getProductUnit = (productType) => {
    const units = {
      'furniture': 'units',
      'electronics': 'units',
      'supplies': 'items'
    };
    return units[productType] || 'units';
  };

  // Add new stock
  const addStock = async (stockData) => {
    try {
      setLoading(true);
      const response = await api.post('/Admin/Stock/AddStock', stockData);
      fetchStockData(); // Refresh stock data after adding
      return response.data;
    } catch (err) {
      console.error('Error adding stock:', err);
      setError('Failed to add stock. Please try again later.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // New function to update thresholds for a specific stock item
  const updateThresholds = async (stockId, lowThreshold, highThreshold) => {
    try {
      setLoading(true);
      
      // Since we're not modifying the backend, we'll update the thresholds locally
      // In a real implementation, this would make an API call to update the backend
      
      // Update the stock data in state
      const updatedStockData = stockData.map(item => {
        if (item.id === stockId) {
          return {
            ...item,
            low_threshold: lowThreshold,
            high_threshold: highThreshold
          };
        }
        return item;
      });
      
      setStockData(updatedStockData);
      
      // Save the threshold settings to localStorage for persistence between sessions
      // This is a temporary solution until backend support is implemented
      const thresholdSettings = JSON.parse(localStorage.getItem('stockThresholds') || '{}');
      thresholdSettings[stockId] = { low: lowThreshold, high: highThreshold };
      localStorage.setItem('stockThresholds', JSON.stringify(thresholdSettings));
      
      // Recalculate alert statistics
      const lowItems = updatedStockData.filter(item => item.qte < item.low_threshold);
      const criticalItems = updatedStockData.filter(item => item.qte < (item.low_threshold / 2));
      
      setAlertStats({
        lowCount: lowItems.length,
        criticalCount: criticalItems.length
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return { success: true };
    } catch (err) {
      console.error('Error updating thresholds:', err);
      setError('Failed to update thresholds.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load saved threshold settings from localStorage
  const loadSavedThresholds = () => {
    try {
      const thresholdSettings = JSON.parse(localStorage.getItem('stockThresholds') || '{}');
      
      if (Object.keys(thresholdSettings).length > 0 && stockData.length > 0) {
        const updatedStockData = stockData.map(item => {
          const savedThresholds = thresholdSettings[item.id];
          if (savedThresholds) {
            return {
              ...item,
              low_threshold: savedThresholds.low,
              high_threshold: savedThresholds.high
            };
          }
          return item;
        });
        
        setStockData(updatedStockData);
      }
    } catch (error) {
      console.error('Error loading saved thresholds:', error);
    }
  };

  useEffect(() => {
    fetchStockData();
    
    // Set up periodic refresh every 5 minutes
    const intervalId = setInterval(fetchStockData, 300000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Load saved thresholds after stock data is fetched
  useEffect(() => {
    if (stockData.length > 0) {
      loadSavedThresholds();
    }
  }, [stockData.length]);

  return (
    <StockContext.Provider value={{ 
      stockData, 
      loading, 
      error, 
      alertStats,
      getLowStockItems, 
      getCriticalStockItems,
      getProductUnit,
      fetchStockData,
      addStock,
      updateThresholds
    }}>
      {children}
    </StockContext.Provider>
  );
};