import React, { useState } from 'react';
import SideBar from "../components/SideBar";
import NavigationBar from '../components/NavigationBar';
import '../styles/Budgets.css';
import { useAuth } from '../contexts/AuthContext';

const Budget = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('monthly');

  const budgetData = {
    monthly: [
      { id: 1, category: 'Room Revenue', planned: 120000, actual: 132500, variance: 12500 },
      { id: 2, category: 'F&B Revenue', planned: 45000, actual: 48200, variance: 3200 },
      { id: 3, category: 'Staff Payroll', planned: 58000, actual: 56800, variance: -1200 },
      { id: 4, category: 'Utilities', planned: 12000, actual: 11450, variance: -550 },
      { id: 5, category: 'Maintenance', planned: 8500, actual: 9700, variance: 1200 },
      { id: 6, category: 'Marketing', planned: 15000, actual: 15000, variance: 0 },
      { id: 7, category: 'Supplies', planned: 6800, actual: 7200, variance: 400 }
    ],
    quarterly: [
      { id: 1, category: 'Room Revenue', planned: 360000, actual: 378900, variance: 18900 },
      { id: 2, category: 'F&B Revenue', planned: 135000, actual: 141600, variance: 6600 },
      { id: 3, category: 'Staff Payroll', planned: 174000, actual: 172400, variance: -1600 },
      { id: 4, category: 'Utilities', planned: 36000, actual: 35200, variance: -800 },
      { id: 5, category: 'Maintenance', planned: 25500, actual: 28900, variance: 3400 },
      { id: 6, category: 'Marketing', planned: 45000, actual: 45000, variance: 0 },
      { id: 7, category: 'Supplies', planned: 20400, actual: 22500, variance: 2100 }
    ],
    yearly: [
      { id: 1, category: 'Room Revenue', planned: 1440000, actual: 1530000, variance: 90000 },
      { id: 2, category: 'F&B Revenue', planned: 540000, actual: 574000, variance: 34000 },
      { id: 3, category: 'Staff Payroll', planned: 696000, actual: 692000, variance: -4000 },
      { id: 4, category: 'Utilities', planned: 144000, actual: 139800, variance: -4200 },
      { id: 5, category: 'Maintenance', planned: 102000, actual: 112500, variance: 10500 },
      { id: 6, category: 'Marketing', planned: 180000, actual: 180000, variance: 0 },
      { id: 7, category: 'Supplies', planned: 81600, actual: 86300, variance: 4700 }
    ]
  };

  const calculateTotals = (data) => {
    return data.reduce((acc, item) => {
      return {
        planned: acc.planned + item.planned,
        actual: acc.actual + item.actual,
        variance: acc.variance + item.variance
      };
    }, { planned: 0, actual: 0, variance: 0 });
  };

  const activeData = budgetData[activeTab];
  const totals = calculateTotals(activeData);

  const summaryCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(activeData[0].actual + activeData[1].actual),
      change: '+5.8%',
      isPositive: true
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(activeData[2].actual + activeData[3].actual + activeData[4].actual + activeData[5].actual + activeData[6].actual),
      change: '+1.2%',
      isPositive: false
    },
    {
      title: 'Net Profit',
      value: formatCurrency(totals.actual),
      change: '+7.4%',
      isPositive: true
    }
  ];

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }

  return (
    <div className="budget-page">
      <SideBar />
      <NavigationBar />
      <div className="budget-content">
        <div className="budget-content-inner">
           
      <div className="budget-header">
        <h2>Budgets</h2>
      </div>

          <div className="budget-summary">
            {summaryCards.map((card, index) => (
              <div className="budget-card" key={index}>
                <h3 className="card-title">{card.title}</h3>
                <div className="card-value">{card.value}</div>
                <div className={`card-change ${card.isPositive ? 'positive' : 'negative'}`}>
                  <span className="card-change-icon">{card.isPositive ? '↑' : '↓'}</span>
                  <span>{card.change} Since last period</span>
                </div>
              </div>
            ))}
          </div>

          {/* Budget Table Section */}
          <div className="budget-table-section">
            <div className="budget-tabs">
              <div className="budget-tab-group">
                {['monthly', 'quarterly', 'yearly'].map((tab) => (
                  <button
                    key={tab}
                    className={`budget-tab ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="budget-table-container">
              <table className="budget-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Planned</th>
                    <th>Actual</th>
                    <th>Variance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeData.map(item => (
                    <tr key={item.id}>
                      <td>{item.category}</td>
                      <td>{formatCurrency(item.planned)}</td>
                      <td>{formatCurrency(item.actual)}</td>
                      <td className={item.variance >= 0 ? 'positive' : 'negative'}>
                        {item.variance >= 0 ? '+' : ''}{formatCurrency(item.variance)}
                      </td>
                      <td>
                        <div className="status-indicator">
                          <div className={`status-dot ${item.variance >= 0 ? 'positive' : 'negative'}`} />
                          <span>{item.variance >= 0 ? 'On Target' : 'Over Budget'}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td><strong>Total</strong></td>
                    <td><strong>{formatCurrency(totals.planned)}</strong></td>
                    <td><strong>{formatCurrency(totals.actual)}</strong></td>
                    <td className={totals.variance >= 0 ? 'positive' : 'negative'}>
                      <strong>{totals.variance >= 0 ? '+' : ''}{formatCurrency(totals.variance)}</strong>
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Budget;