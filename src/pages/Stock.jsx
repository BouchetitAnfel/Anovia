import React, { useState, useEffect } from 'react';
import '../styles/Stock.css';
import SideBar from "../components/SideBar";
import NavigationBar from '../components/NavigationBar';
import api from '../api';


const Stock = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStockData();
  }, []);

  const fetchStockData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/Admin/Stock/List');
      setStockData(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Failed to load stock data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SideBar />
      <NavigationBar />
      
      <div className="stock-header">
        <h2>Stock Management</h2>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="stock-table-container">
        <table className="stock-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Quantity</th>
              <th>Product ID</th>
              <th>Type</th>
              <th>Quality</th>
              <th>Manager ID</th>
              <th>Date Entered</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="loading-message">Loading stock data...</td>
              </tr>
            ) : stockData.length > 0 ? (
              stockData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.qte}</td>
                  <td>{item.id_product}</td>
                  <td>{item.product_type}</td>
                  <td>{item.qualite}</td>
                  <td>{item.id_manager || '-'}</td>
                  <td>{item.date_enter}</td>
                  <td>{item.location}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="empty-message">No stock items available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stock;