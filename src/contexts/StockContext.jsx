// src/contexts/StockContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const StockContext = createContext();

export const useStock = () => useContext(StockContext);

export const StockProvider = ({ children }) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Admin/Stock/List');
      setStockData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to load stock data. Please try again later.');
      // For development without backend, use sample data
      setStockData([
        { id: 1, qte: 5, id_product: 101, product_type: 'Beds', qualite: 'Good', id_manager: 1, date_enter: '2025-01-15', location: 'Warehouse A', threshold: 10, unit: 'units' },
        { id: 2, qte: 12, id_product: 102, product_type: 'Shampoo', qualite: 'Excellent', id_manager: 2, date_enter: '2025-02-01', location: 'Warehouse B', threshold: 20, unit: 'bottles' },
        { id: 3, qte: 8, id_product: 103, product_type: 'Food (Dry)', qualite: 'Good', id_manager: 1, date_enter: '2025-03-10', location: 'Warehouse A', threshold: 15, unit: 'kg' },
        { id: 4, qte: 7, id_product: 104, product_type: 'Towels', qualite: 'Fair', id_manager: 3, date_enter: '2025-01-20', location: 'Warehouse C', threshold: 15, unit: 'units' },
        { id: 5, qte: 4, id_product: 105, product_type: 'Pet Toys', qualite: 'Good', id_manager: 2, date_enter: '2025-02-25', location: 'Warehouse B', threshold: 10, unit: 'units' },
        { id: 6, qte: 25, id_product: 106, product_type: 'Blankets', qualite: 'Excellent', id_manager: 1, date_enter: '2025-03-05', location: 'Warehouse A', threshold: 15, unit: 'units' },
        { id: 7, qte: 18, id_product: 107, product_type: 'Collars', qualite: 'Good', id_manager: 3, date_enter: '2025-01-10', location: 'Warehouse C', threshold: 10, unit: 'units' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Get low stock items (items where quantity is below threshold)
  const getLowStockItems = () => {
    return stockData.filter(item => item.qte < item.threshold);
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  return (
    <StockContext.Provider value={{ stockData, loading, error, getLowStockItems, fetchStockData }}>
      {children}
    </StockContext.Provider>
  );
};