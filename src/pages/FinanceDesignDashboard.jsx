import { useEffect, useMemo, useState } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, Wallet, DollarSign, Trash2, Sun, MoonStar } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { expensesService } from '../services/supabaseClient';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Shopping', 'Education', 'Debt', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
const CATEGORY_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6b7280'];

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function FinanceDesignDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [formType, setFormType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    loadTransactions();
  }, []);

  async function loadTransactions() {
    setLoading(true);
    try {
      const data = await expensesService.fetchAll();
      setTransactions(data || []);
      setError('');
    } catch (err) {
      setError(err?.message || 'Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  }

  const normalized = useMemo(() => {
    return transactions.map((t) => {
      const value = Number(t.amount);
      const type = value > 0 ? 'income' : t.category === 'Debt' ? 'debt' : 'expense';
      return {
        ...t,
        amount: value,
        type,
      };
    });
  }, [transactions]);

  const totalIncome = useMemo(
    () => normalized.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0),
    [normalized]
  );

  const totalExpenses = useMemo(
    () => normalized.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0),
    [normalized]
  );

  const balance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  const expensesByCategory = useMemo(() => {
    const bucket = {};
    normalized
      .filter((t) => t.amount < 0)
      .forEach((t) => {
        bucket[t.category] = (bucket[t.category] || 0) + Math.abs(t.amount);
      });

    return Object.keys(bucket).map((name) => ({ name, value: bucket[name] }));
  }, [normalized]);

  const theme = isDarkMode
    ? {
        pageBg: '#1E2520',
        cardBg: '#242D27',
        cardBgSoft: '#2A332D',
        cardBorder: '#3C4741',
        text: '#F9FAFB',
        muted: '#C7D0CA',
        inputBg: '#2A332D',
        inputBorder: '#516059',
        panelRowBg: '#2B342E',
        panelTitle: '#F9FAFB',
        controlBg: '#3A463F',
        controlText: '#F9FAFB',
        toggleBorder: '#5F6C66',
      }
    : {
        pageBg: '#EDE7DD',
        cardBg: '#F7F1E6',
        cardBgSoft: '#F3EEDF',
        cardBorder: '#D9CDBB',
        text: '#1F2937',
        muted: '#6B7280',
        inputBg: '#FFFDF8',
        inputBorder: '#CFC5B5',
        panelRowBg: '#FBF8F1',
        panelTitle: '#111827',
        controlBg: '#E6DCCB',
        controlText: '#1F2937',
        toggleBorder: '#BFAF97',
      };

  async function handleAddTransaction(e) {
    e.preventDefault();
    if (!amount || !category || !description) {
      setError('Please fill out all transaction fields.');
      return;
    }

    const value = Math.abs(parseFloat(amount));
    const signedAmount = formType === 'income' ? value : -value;

    setLoading(true);
    try {
      const created = await expensesService.add({
        amount: signedAmount,
        category,
        date: new Date().toISOString().split('T')[0],
        note: description,
      });
      setTransactions((prev) => [created, ...prev]);
      setAmount('');
      setCategory('');
      setDescription('');
      setFormType('expense');
      setShowForm(false);
      setError('');
    } catch (err) {
      setError(err?.message || 'Failed to add transaction.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this transaction?')) return;
    setLoading(true);
    try {
      await expensesService.delete(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      setError('');
    } catch (err) {
      setError(err?.message || 'Failed to delete transaction.');
    } finally {
      setLoading(false);
    }
  }

  const typeButtonClass = (active, color) =>
    `px-3 py-2 rounded text-sm ${active ? color + ' text-white' : 'bg-gray-200 text-gray-700'}`;

  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.pageBg }}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
          <img src="/barya-logo.png" alt="Barya Logo" className="h-[100px] w-[100px] object-contain dark:invert" />
          <div>
            <h1 className="text-3xl font-semibold" style={{ color: theme.text }}>Barya</h1>
            <p className="text-sm" style={{ color: theme.muted }}>Track and manage your expenses</p>
          </div>
          </div>
          <button
            type="button"
            onClick={() => setIsDarkMode((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition"
            style={{
              backgroundColor: theme.controlBg,
              color: theme.controlText,
              border: `1px solid ${theme.toggleBorder}`,
            }}
          >
            {isDarkMode ? <Sun size={16} /> : <MoonStar size={16} />}
            {isDarkMode ? 'Light mode' : 'Dark mode'}
          </button>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-800">{error}</div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg shadow-soft p-6" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: theme.muted }}>Total Balance</span>
              <Wallet className="text-blue-500" size={20} />
            </div>
            <p className={`text-3xl font-semibold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </p>
          </div>

          <div className="rounded-lg shadow-soft p-6" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: theme.muted }}>Total Income</span>
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <p className="text-3xl font-semibold text-green-600">{formatCurrency(totalIncome)}</p>
          </div>

          <div className="rounded-lg shadow-soft p-6" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <div className="flex items-center justify-between mb-2">
              <span style={{ color: theme.muted }}>Total Expenses</span>
              <TrendingDown className="text-red-400" size={20} />
            </div>
            <p className="text-3xl font-semibold text-red-400">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-600 transition"
          >
            <PlusCircle size={20} />
            Add Transaction
          </button>
        </div>

        {showForm && (
          <div className="rounded-lg shadow-soft border p-6 mb-8" style={{ backgroundColor: theme.cardBgSoft, borderColor: theme.cardBorder }}>
            <h2 className="text-xl mb-4" style={{ color: theme.panelTitle }}>New Transaction</h2>
            <form onSubmit={handleAddTransaction}>
              <div className="mb-4">
                <label className="block mb-2" style={{ color: theme.muted }}>Type</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormType('expense');
                      if (!category || category === 'Salary' || category === 'Debt') setCategory('Food');
                    }}
                    className={typeButtonClass(formType === 'expense', 'bg-red-500')}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormType('income');
                      setCategory('Salary');
                    }}
                    className={typeButtonClass(formType === 'income', 'bg-green-500')}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormType('debt');
                      setCategory('Debt');
                    }}
                    className={typeButtonClass(formType === 'debt', 'bg-amber-500')}
                  >
                    Debt
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2" style={{ color: theme.muted }}>Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}` }}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block mb-2" style={{ color: theme.muted }}>Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}` }}
                  required
                >
                  <option value="">Select category</option>
                  {(formType === 'income' ? INCOME_CATEGORIES : formType === 'debt' ? ['Debt'] : EXPENSE_CATEGORIES).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2" style={{ color: theme.muted }}>Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ backgroundColor: theme.inputBg, color: theme.text, border: `1px solid ${theme.inputBorder}` }}
                  placeholder="Enter description"
                  required
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition disabled:opacity-60"
                >
                  Add Transaction
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2 rounded transition"
                  style={{ backgroundColor: theme.controlBg, color: theme.controlText }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-lg shadow-soft border p-6" style={{ backgroundColor: theme.cardBgSoft, borderColor: theme.cardBorder }}>
            <h2 className="text-xl mb-4" style={{ color: theme.panelTitle }}>Expenses by Category</h2>
            {expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center" style={{ color: theme.muted }}>No expense data yet</div>
            )}
          </div>

          <div className="rounded-lg shadow-soft border p-6" style={{ backgroundColor: theme.cardBgSoft, borderColor: theme.cardBorder }}>
            <h2 className="text-xl mb-4" style={{ color: theme.panelTitle }}>Recent Transactions</h2>
            <div className="space-y-3 max-h-96 overflow-auto">
              {normalized.slice(0, 10).map((transaction) => {
                const positive = transaction.amount > 0;
                const amountColor = positive ? 'text-green-600' : 'text-red-600';
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded border" style={{ backgroundColor: theme.panelRowBg, borderColor: theme.cardBorder }}>
                    <div className="flex-1">
                      <div className="font-medium" style={{ color: theme.text }}>{transaction.note || transaction.category}</div>
                      <div className="text-sm" style={{ color: theme.muted }}>
                        {transaction.category} • {transaction.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`text-lg font-semibold ${amountColor}`}>
                        {positive ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                      </div>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="hover:text-red-600"
                        style={{ color: theme.muted }}
                        title="Delete transaction"
                        disabled={loading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
