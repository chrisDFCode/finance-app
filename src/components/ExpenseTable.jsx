import React from 'react';
import { FiTrash2 } from 'react-icons/fi';
import { formatCurrency, formatDate } from '../utils/helpers';
import '../styles/components.css';

function ExpenseTable({ expenses, onDelete, loading }) {
  if (expenses.length === 0) {
    return (
      <div className="empty-state">
        <p>No expenses yet. Add one to get started!</p>
      </div>
    );
  }

  return (
    <div className="expenses-table-container">
      <h2>All Expenses</h2>
      <table className="expenses-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Note</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(expense => (
            <tr key={expense.id} className="expense-row">
              <td>{formatDate(expense.date)}</td>
              <td>
                <span className="category-badge">
                  {expense.category}
                </span>
              </td>
              <td className="amount">
                {formatCurrency(expense.amount)}
              </td>
              <td className="note">
                {expense.note || '-'}
              </td>
              <td>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(expense.id)}
                  disabled={loading}
                  title="Delete expense"
                >
                  <FiTrash2 />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseTable;
