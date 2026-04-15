import React, { useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import AddExpenseForm from '../components/AddExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import CategoryFilter from '../components/CategoryFilter';
import MonthlySummary from '../components/MonthlySummary';
import ChartComponent from '../components/ChartComponent';
import StatsSection from '../components/StatsSection';
import { useExpenses, useFilter } from '../hooks/useExpenses';
import { expensesService } from '../services/supabaseClient';
import '../styles/dashboard.css';

function Dashboard() {
  const { expenses, setExpensesData, addExpense, removeExpense, setLoading, loading, error, setError } = useExpenses();
  const { selectedCategory, setSelectedCategory } = useFilter();

  // Fetch expenses on mount
  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    setLoading(true);
    try {
      const data = await expensesService.fetchAll();
      setExpensesData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load expenses. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (expenseData) => {
    setLoading(true);
    try {
      const newExpense = await expensesService.add(expenseData);
      addExpense(newExpense);
      setError(null);
    } catch (err) {
      setError('Failed to add expense. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    setLoading(true);
    try {
      await expensesService.delete(id);
      removeExpense(id);
      setError(null);
    } catch (err) {
      setError('Failed to delete expense. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter expenses based on selected category
  const filteredExpenses = selectedCategory === 'All'
    ? expenses
    : expenses.filter(exp => exp.category === selectedCategory);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>💰 Finance Tracker</h1>
          <p>Manage your expenses and track your spending</p>
        </div>
      </header>

      <main className="dashboard-main">
        {error && (
          <div className="error-banner">
            <FiAlertCircle /> {error}
            <button onClick={() => setError(null)} className="close-btn">×</button>
          </div>
        )}

        <div className="dashboard-container">
          {/* Left Column */}
          <div className="left-column">
            <AddExpenseForm onAddExpense={handleAddExpense} loading={loading} />
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Right Column */}
          <div className="right-column">
            <StatsSection expenses={filteredExpenses} loading={loading} />
            <MonthlySummary expenses={filteredExpenses} />
          </div>
        </div>

        {/* Full Width Sections */}
        <div className="full-width">
          <ChartComponent expenses={filteredExpenses} />
        </div>

        <div className="full-width">
          <ExpenseTable
            expenses={filteredExpenses}
            onDelete={handleDeleteExpense}
            loading={loading}
          />
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2024 Finance Tracker. Built with React & Supabase.</p>
      </footer>
    </div>
  );
}

export default Dashboard;
