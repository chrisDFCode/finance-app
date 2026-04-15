import React, { useMemo } from 'react';
import { formatCurrency, calculateCategoryTotal } from '../utils/helpers';
import '../styles/components.css';

function MonthlySummary({ expenses, month = null, year = null }) {
  const now = new Date();
  const selectedMonth = month || now.getMonth() + 1;
  const selectedYear = year || now.getFullYear();

  const monthlyExpenses = useMemo(() => {
    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 1);

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate < endDate;
    });
  }, [expenses, selectedMonth, selectedYear]);

  const total = useMemo(() => {
    return monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [monthlyExpenses]);

  const categoryTotals = useMemo(() => {
    return calculateCategoryTotal(monthlyExpenses);
  }, [monthlyExpenses]);

  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="monthly-summary">
      <h2>Monthly Summary - {monthName}</h2>

      <div className="summary-stats">
        <div className="stat-card">
          <h4>Total Spending</h4>
          <p className="stat-value">{formatCurrency(total)}</p>
          <small>{monthlyExpenses.length} transactions</small>
        </div>
      </div>

      {Object.keys(categoryTotals).length > 0 ? (
        <div className="category-breakdown">
          <h4>By Category</h4>
          <div className="breakdown-list">
            {Object.entries(categoryTotals).map(([category, amount]) => (
              <div key={category} className="breakdown-item">
                <span className="category-name">{category}</span>
                <span className="category-amount">{formatCurrency(amount)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="no-data">No expenses this month</p>
      )}
    </div>
  );
}

export default MonthlySummary;
