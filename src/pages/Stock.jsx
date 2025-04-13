import React from 'react';
import '../styles/Stock.css';
import SideBar from "../components/SideBar";
import NavigationBar from '../components/NavigationBar';
import { useStock } from '../contexts/StockContext';

const Stock = () => {
  const { stockData, loading, error } = useStock();

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
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="loading-message">Loading stock data...</td>
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
                  <td>
                    <span className={`stock-status ${item.qte < item.threshold ? 'low' : 'ok'}`}>
                      {item.qte < item.threshold ? 'Low Stock' : 'In Stock'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="empty-message">No stock items available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stock;