import { useState, useCallback } from 'react';

/**
 * Custom hook for managing expenses
 */
export function useExpenses(initialData = []) {
  const [expenses, setExpenses] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addExpense = useCallback((expense) => {
    setExpenses(prev => [expense, ...prev]);
  }, []);

  const removeExpense = useCallback((id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  }, []);

  const setExpensesData = useCallback((data) => {
    setExpenses(data);
  }, []);

  return {
    expenses,
    setExpensesData,
    addExpense,
    removeExpense,
    loading,
    setLoading,
    error,
    setError
  };
}

/**
 * Custom hook for managing filter state
 */
export function useFilter(initialCategory = 'All') {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  return {
    selectedCategory,
    setSelectedCategory
  };
}
