import React, { useEffect, useState } from 'react';
import { formatCurrency, calculateTotal } from '../utils/helpers';
import '../styles/components.css';

function StatsSection({ expenses, loading }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(calculateTotal(expenses));
  }, [expenses]);

  return (
    <div className="stats-section">
      <div className="stat-card-large">
        <h3>Total Spending</h3>
        <p className="total-amount">{formatCurrency(total)}</p>
        <small>{expenses.length} transactions</small>
      </div>

      <div className="stat-card-large">
        <h3>Average Per Transaction</h3>
        <p className="total-amount">
          {expenses.length > 0
            ? formatCurrency(total / expenses.length)
            : formatCurrency(0)}
        </p>
      </div>

      <div className="stat-card-large">
        <h3>Total Transactions</h3>
        <p className="total-amount">{expenses.length}</p>
      </div>
    </div>
  );
}

export default StatsSection;
