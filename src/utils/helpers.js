/**
 * Format number as currency
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

/**
 * Format date to readable string
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Get category color
 */
export function getCategoryColor(category) {
  const colors = {
    'Food': '#FF6B6B',
    'Transport': '#4ECDC4',
    'Entertainment': '#FFE66D',
    'Utilities': '#95E1D3',
    'Health': '#F38181',
    'Shopping': '#AA96DA',
    'Education': '#FCBAD3',
    'Other': '#A8DADC'
  };
  return colors[category] || '#A8DADC';
}

/**
 * Group expenses by category
 */
export function groupByCategory(expenses) {
  return expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(expense);
    return acc;
  }, {});
}

/**
 * Calculate total by category
 */
export function calculateCategoryTotal(expenses) {
  const grouped = groupByCategory(expenses);
  return Object.keys(grouped).reduce((acc, category) => {
    acc[category] = grouped[category].reduce((sum, expense) => sum + expense.amount, 0);
    return acc;
  }, {});
}

/**
 * Calculate total spending
 */
export function calculateTotal(expenses) {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}
