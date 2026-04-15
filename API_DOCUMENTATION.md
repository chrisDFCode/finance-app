# 📚 Finance App - API & Component Documentation

## Supabase API Reference

### Expenses Service (`src/services/supabaseClient.js`)

All methods are async and must be awaited.

---

## Methods

### `fetchAll()`
Retrieve all expenses ordered by date (newest first).

**Parameters**: None

**Returns**: `Promise<Array<Expense>>`

**Example**:
```javascript
try {
  const expenses = await expensesService.fetchAll();
  console.log(expenses);
  // [
  //   { id: 1, amount: 50, category: 'Food', date: '2024-04-15', note: 'Lunch', ... },
  //   { id: 2, amount: 30, category: 'Transport', date: '2024-04-14', note: 'Uber', ... }
  // ]
} catch (error) {
  console.error('Error fetching expenses:', error.message);
}
```

---

### `add(expense)`
Create a new expense entry in the database.

**Parameters**:
```typescript
{
  amount: number,           // Required: 0.01 - 99999999.99
  category: string,         // Required: One of 8 categories
  date: string,            // Required: YYYY-MM-DD format
  note?: string            // Optional: Max 500 characters
}
```

**Returns**: `Promise<Expense>` (same object with `id` and timestamps)

**Example**:
```javascript
const newExpense = await expensesService.add({
  amount: 25.50,
  category: 'Food',
  date: '2024-04-15',
  note: 'Coffee at Starbucks'
});

console.log(newExpense);
// {
//   id: 3,
//   amount: 25.50,
//   category: 'Food',
//   date: '2024-04-15',
//   note: 'Coffee at Starbucks',
//   created_at: '2024-04-15T10:30:00Z',
//   updated_at: '2024-04-15T10:30:00Z'
// }
```

---

### `delete(id)`
Delete an expense by ID.

**Parameters**:
- `id` (number): Expense ID to delete

**Returns**: `Promise<void>`

**Example**:
```javascript
await expensesService.delete(3);
console.log('Expense deleted successfully');
```

---

### `getByCategory(category)`
Get all expenses for a specific category.

**Parameters**:
- `category` (string): One of the 8 available categories

**Returns**: `Promise<Array<Expense>>`

**Example**:
```javascript
const foodExpenses = await expensesService.getByCategory('Food');
console.log(foodExpenses);
// [
//   { id: 1, amount: 50, category: 'Food', date: '2024-04-15', ... },
//   { id: 4, amount: 25.50, category: 'Food', date: '2024-04-14', ... }
// ]
```

---

### `getMonthlySummary(year, month)`
Get all expenses for a specific month.

**Parameters**:
- `year` (number): E.g., 2024
- `month` (number): 1-12

**Returns**: `Promise<Array<Expense>>`

**Example**:
```javascript
const aprilExpenses = await expensesService.getMonthlySummary(2024, 4);
console.log(`Found ${aprilExpenses.length} expenses in April 2024`);
```

---

## Types & Interfaces

### Expense Object
```typescript
interface Expense {
  id: number;                    // Auto-generated primary key
  amount: number;                // 0.01 - 99999999.99
  category: string;              // 'Food' | 'Transport' | ... (8 total)
  date: string;                  // YYYY-MM-DD format
  note: string | null;           // Optional text field
  created_at: string;            // ISO timestamp
  updated_at: string;            // ISO timestamp
}
```

---

## Utility Functions

### helpers.js Functions

#### `formatCurrency(amount)`
Format a number as US currency.

```javascript
formatCurrency(100);           // "$100.00"
formatCurrency(99.5);          // "$99.50"
formatCurrency(0);             // "$0.00"
formatCurrency(1000000);       // "$1,000,000.00"
```

---

#### `formatDate(dateString)`
Format an ISO date string to readable format.

```javascript
formatDate('2024-04-15');      // "Apr 15, 2024"
formatDate('2024-01-01');      // "Jan 1, 2024"
formatDate('2024-12-25');      // "Dec 25, 2024"
```

---

#### `getCategoryColor(category)`
Get the hex color code for a category.

```javascript
getCategoryColor('Food');              // "#FF6B6B" (red)
getCategoryColor('Transport');         // "#4ECDC4" (teal)
getCategoryColor('Entertainment');     // "#FFE66D" (yellow)
getCategoryColor('Utilities');         // "#95E1D3" (mint)
getCategoryColor('Health');            // "#F38181" (pink)
getCategoryColor('Shopping');          // "#AA96DA" (purple)
getCategoryColor('Education');         // "#FCBAD3" (light pink)
getCategoryColor('Other');             // "#A8DADC" (blue)
```

---

#### `groupByCategory(expenses)`
Group expenses array by category.

**Returns**: `Object<string, Array<Expense>>`

```javascript
const grouped = groupByCategory([
  { id: 1, amount: 50, category: 'Food', ... },
  { id: 2, amount: 30, category: 'Transport', ... },
  { id: 3, amount: 45, category: 'Food', ... }
]);

// Result:
// {
//   Food: [
//     { id: 1, amount: 50, category: 'Food', ... },
//     { id: 3, amount: 45, category: 'Food', ... }
//   ],
//   Transport: [
//     { id: 2, amount: 30, category: 'Transport', ... }
//   ]
// }
```

---

#### `calculateCategoryTotal(expenses)`
Calculate total spending per category.

**Returns**: `Object<string, number>`

```javascript
const totals = calculateCategoryTotal([
  { id: 1, amount: 50, category: 'Food', ... },
  { id: 2, amount: 30, category: 'Transport', ... },
  { id: 3, amount: 45, category: 'Food', ... }
]);

// Result:
// {
//   Food: 95,
//   Transport: 30
// }
```

---

#### `calculateTotal(expenses)`
Calculate total spending across all expenses.

**Returns**: `number`

```javascript
const total = calculateTotal([
  { id: 1, amount: 50, category: 'Food', ... },
  { id: 2, amount: 30, category: 'Transport', ... },
  { id: 3, amount: 45, category: 'Food', ... }
]);

console.log(total);  // 125
```

---

## Custom Hooks

### `useExpenses(initialData?)`
Manage expense state and operations.

**Parameters**: Optional initial data array

**Returns**:
```typescript
{
  expenses: Expense[];                    // Current expenses array
  setExpensesData: (data: Expense[]) => void;  // Set all expenses
  addExpense: (expense: Expense) => void;      // Add single expense
  removeExpense: (id: number) => void;         // Remove by ID
  loading: boolean;                       // Loading state
  setLoading: (state: boolean) => void;   // Set loading state
  error: string | null;                   // Error message
  setError: (msg: string | null) => void; // Set error
}
```

**Example**:
```javascript
function MyComponent() {
  const { expenses, addExpense, removeExpense, loading } = useExpenses();

  return (
    // Component JSX using above values
  );
}
```

---

### `useFilter(initialCategory?)`
Manage category filter state.

**Parameters**: Optional initial category (default: 'All')

**Returns**:
```typescript
{
  selectedCategory: string;          // Current selected category
  setSelectedCategory: (cat: string) => void;  // Change category
}
```

**Example**:
```javascript
const { selectedCategory, setSelectedCategory } = useFilter('Food');

// To change filter
setSelectedCategory('Transport');
```

---

## Component Props Reference

### AddExpenseForm
```typescript
interface Props {
  onAddExpense: (expense: {
    amount: number;
    category: string;
    date: string;
    note: string;
  }) => Promise<void>;
  loading: boolean;
}
```

### ExpenseTable
```typescript
interface Props {
  expenses: Expense[];
  onDelete: (id: number) => Promise<void>;
  loading: boolean;
}
```

### CategoryFilter
```typescript
interface Props {
  selectedCategory: string;  // 'All' or category name
  onCategoryChange: (category: string) => void;
}
```

### MonthlySummary
```typescript
interface Props {
  expenses: Expense[];
  month?: number;           // 1-12, default: current month
  year?: number;            // Default: current year
}
```

### ChartComponent
```typescript
interface Props {
  expenses: Expense[];  // Data to visualize
}
```

### StatsSection
```typescript
interface Props {
  expenses: Expense[];
  loading: boolean;
}
```

---

## Error Handling

### Supabase Errors
```javascript
try {
  const data = await expensesService.fetchAll();
} catch (error) {
  // error.message contains the error message
  console.error('Failed to fetch:', error.message);
}
```

### Form Validation
```javascript
if (!amount || isNaN(amount) || amount <= 0) {
  setFormError('Please enter a valid amount');
  return;
}

if (!date) {
  setFormError('Please select a date');
  return;
}
```

---

## Best Practices

### 1. Always Await Async Operations
```javascript
// ❌ Wrong
const data = expensesService.fetchAll();

// ✅ Correct
const data = await expensesService.fetchAll();
```

### 2. Handle Errors
```javascript
// ✅ Good
try {
  const data = await expensesService.fetchAll();
} catch (error) {
  setError(error.message);
}
```

### 3. Set Loading States
```javascript
// ✅ Good
setLoading(true);
try {
  await expensesService.add(data);
} finally {
  setLoading(false);
}
```

### 4. Validate Input Data
```javascript
// ✅ Good
const newExpense = {
  amount: parseFloat(formData.amount),
  category: formData.category,
  date: formData.date,
  note: formData.note || null
};
```

## Performance Tips

1. **Memoize Calculations**: Use `useMemo` for expensive calculations
2. **Lazy Load Charts**: Only render charts when needed
3. **Database Indexes**: Queries use indexed columns (date, category)
4. **Pagination**: Consider adding pagination for 1000+ expenses
5. **Caching**: Cache frequently accessed data locally

---

## Rate Limits

Supabase includes rate limits:
- **Free tier**: 50 requests/second
- **Pro tier**: 150 requests/second

Monitor usage in Supabase dashboard → Logs.

---

## Common Patterns

### Fetch and Update UI
```javascript
try {
  setLoading(true);
  const data = await expensesService.fetchAll();
  setExpensesData(data);
} catch (error) {
  setError(error.message);
} finally {
  setLoading(false);
}
```

### Add and Refresh
```javascript
try {
  const newExpense = await expensesService.add(formData);
  addExpense(newExpense);  // Add to local state immediately
} catch (error) {
  setError(error.message);
}
```

### Delete with Confirmation
```javascript
if (window.confirm('Delete this expense?')) {
  try {
    await expensesService.delete(id);
    removeExpense(id);
  } catch (error) {
    setError(error.message);
  }
}
```

---

## Testing Examples

### Unit Test (Jest)
```javascript
test('formatCurrency formats correctly', () => {
  expect(formatCurrency(100)).toBe('$100.00');
  expect(formatCurrency(99.5)).toBe('$99.50');
});

test('calculateTotal sums expenses', () => {
  const expenses = [
    { amount: 50 },
    { amount: 30 },
    { amount: 45 }
  ];
  expect(calculateTotal(expenses)).toBe(125);
});
```

### Integration Test
```javascript
test('Add and fetch expense', async () => {
  const newExpense = await expensesService.add({
    amount: 50,
    category: 'Food',
    date: '2024-04-15',
    note: 'Test'
  });

  const expenses = await expensesService.fetchAll();
  expect(expenses).toContainEqual(newExpense);
});
```

---

## Changelog

### Version 1.0.0
- ✅ Full CRUD operations
- ✅ Category filtering
- ✅ Monthly summaries
- ✅ Chart visualization
- ✅ Responsive design
- ✅ Error handling

---

For more information, see:
- [Supabase Docs](https://supabase.com/docs)
- [React Hooks Guide](https://react.dev/reference/react/hooks)
- [Chart.js Docs](https://www.chartjs.org/docs/latest/)
