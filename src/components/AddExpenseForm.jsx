import React, { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import '../styles/components.css';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Shopping', 'Education', 'Other'];

function AddExpenseForm({ onAddExpense, loading }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError('');
  };

  const validateForm = () => {
    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
      setFormError('Please enter a valid amount');
      return false;
    }
    if (!formData.date) {
      setFormError('Please select a date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onAddExpense({
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        note: formData.note
      });

      setFormData({
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
    } catch (error) {
      setFormError(error.message);
    }
  };

  return (
    <form className="add-expense-form" onSubmit={handleSubmit}>
      <h2>Add New Expense</h2>

      {formError && <div className="form-error">{formError}</div>}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            placeholder="0.00"
            value={formData.amount}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={loading}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="note">Note (Optional)</label>
          <input
            type="text"
            id="note"
            name="note"
            placeholder="Add a note..."
            value={formData.note}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={loading}
      >
        <FiPlus /> {loading ? 'Adding...' : 'Add Expense'}
      </button>
    </form>
  );
}

export default AddExpenseForm;
