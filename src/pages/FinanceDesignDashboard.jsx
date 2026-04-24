import { useEffect, useMemo, useState } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, Wallet, DollarSign, Trash2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { expensesService } from '../services/supabaseClient';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Shopping', 'Education', 'Debt', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];
const CATEGORY_COLORS = ['#007b34', '#2f9a58', '#5ab97b', '#7acc93', '#9bd8ac', '#bde5c7', '#d9f1e0', '#e7f7eb', '#f2fbf4'];

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function FinanceDesignDashboard({
  user,
  onSignOut,
  forceMobileView = false,
}) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [formType, setFormType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (user?.id) {
      loadTransactions();
    }
  }, [user?.id]);

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
        text: '#EDE7DD',
        muted: '#C7D0CA',
        inputBg: '#2A332D',
        inputBorder: '#516059',
        panelRowBg: '#2B342E',
        panelTitle: '#EDE7DD',
        controlBg: '#3A463F',
        controlText: '#EDE7DD',
        toggleBorder: '#5F6C66',
        primaryButtonBg: '#A3B18A',
        primaryButtonText: '#EDE7DD',
        primaryButtonHoverBg: '#8D9D73',
        success: '#007b34',
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
        primaryButtonBg: '#5E5A4E',
        primaryButtonText: '#FFFDF8',
        primaryButtonHoverBg: '#4C483F',
        success: '#007b34',
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

  async function handleSignOut() {
    try {
      await onSignOut();
    } catch (err) {
      setError(err?.message || 'Failed to sign out.');
    }
  }

  const typeButtonClass = (active, color) =>
    `px-3 py-2 rounded text-sm ${active ? color : 'bg-gray-200 text-gray-700'}`;
  const activeTypeButtonText = isDarkMode ? '#EDE7DD' : '#FFFFFF';
  const compact = forceMobileView;
  const chartHeight = compact ? 200 : 260;
  const pieOuterRadius = compact ? 60 : 85;

  return (
    <div className="min-h-[100dvh] overflow-x-clip" style={{ backgroundColor: theme.pageBg }}>
      <div className={compact ? 'max-w-6xl mx-auto px-6 py-8' : 'max-w-6xl mx-auto p-4 sm:p-6'}>
        <div className="relative flex items-center justify-between gap-2 mb-8">
          <div className="flex items-center gap-2">
            <img
              src={isDarkMode ? '/barya-logo-dark.png' : '/barya-logo.png'}
              alt="Barya Logo"
              className={compact ? 'h-20 w-20 object-contain' : 'h-24 w-24 object-contain'}
            />
            <div>
              <h1 className={compact ? 'text-2xl font-bold leading-tight' : 'text-3xl font-bold leading-tight'} style={{ color: theme.text }}>
                Barya
              </h1>
            </div>
          </div>
          <div className="relative z-40 shrink-0 self-center">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition"
              style={{
                backgroundColor: theme.controlBg,
                color: theme.controlText,
                borderColor: theme.toggleBorder,
              }}
            >
              Menu
            </button>

            <div
              className={`absolute right-0 top-full mt-2 w-64 rounded-xl border p-3 transition-all duration-150 ${menuOpen ? 'translate-y-0 opacity-100 visible' : '-translate-y-1 opacity-0 invisible'}`}
              style={{
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
                boxShadow: '0 12px 24px rgba(0, 0, 0, 0.18)',
              }}
            >
              <div className="mb-3 rounded-lg border px-3 py-2" style={{ borderColor: theme.cardBorder }}>
                <div className="text-[11px] uppercase tracking-[0.14em]" style={{ color: theme.muted }}>Account</div>
                <div className="mt-1 break-words text-sm font-medium" style={{ color: theme.text }}>
                  {user?.email}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDarkMode((prev) => !prev)}
                className="mb-2 w-full rounded-lg px-3 py-2 text-left text-sm font-medium"
                style={{ backgroundColor: theme.controlBg, color: theme.controlText }}
              >
                {isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium"
                style={{ backgroundColor: '#b91c1c', color: '#FEE2E2' }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-100 px-4 py-3 text-red-800">{error}</div>
        ) : null}

        {/* Large Balance Card */}
        <div className="rounded-xl shadow-lg px-6 py-8 mb-5" style={{ backgroundColor: theme.cardBg, border: `2px solid ${theme.cardBorder}` }}>
          <div style={{ color: theme.muted }} className="text-sm mb-2">Total Balance</div>
          <div className={compact ? 'text-xl font-bold break-words' : 'text-2xl sm:text-3xl lg:text-4xl font-bold'} style={{ color: balance >= 0 ? theme.success : '#dc2626' }}>
            {formatCurrency(balance)}
          </div>
        </div>

        {/* Income & Expenses Side by Side */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-lg shadow px-4 py-6" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <div style={{ color: theme.muted }} className="text-xs mb-2 uppercase">Total Income</div>
            <div className={compact ? 'text-sm font-bold break-words' : 'text-base sm:text-lg lg:text-xl font-bold'} style={{ color: theme.success }}>{formatCurrency(totalIncome)}</div>
          </div>
          <div className="rounded-lg shadow px-4 py-6" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
            <div style={{ color: theme.muted }} className="text-xs mb-2 uppercase">Total Expenses</div>
            <div className={compact ? 'text-sm font-bold break-words text-red-400' : 'text-base sm:text-lg lg:text-xl font-bold text-red-400'}>{formatCurrency(totalExpenses)}</div>
          </div>
        </div>

        <div className={compact ? 'mb-5' : 'mb-5 sm:mb-6'}>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className={compact ? 'w-full px-5 py-3 rounded-lg flex items-center justify-center gap-2 transition hover:opacity-90' : 'w-full sm:w-auto px-5 py-3 rounded-lg flex items-center justify-center gap-2 transition hover:opacity-90'}
            style={{ backgroundColor: theme.primaryButtonBg, color: theme.primaryButtonText }}
          >
            <PlusCircle size={20} />
            Add Transaction
          </button>
        </div>

        {showForm && (
          <div className={compact ? 'rounded-lg shadow-soft border px-6 py-5 mb-6' : 'rounded-lg shadow-soft border p-4 sm:p-6 mb-6 sm:mb-8'} style={{ backgroundColor: theme.cardBgSoft, borderColor: theme.cardBorder }}>
            <h2 className={compact ? 'text-lg mb-4' : 'text-lg sm:text-xl mb-4'} style={{ color: theme.panelTitle }}>New Transaction</h2>
            <form onSubmit={handleAddTransaction}>
              <div className="mb-4">
                <label className="block mb-2" style={{ color: theme.muted }}>Type</label>
                <div className={compact ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-1 gap-2 sm:flex sm:gap-3'}>
                  <button
                    type="button"
                    onClick={() => {
                      setFormType('expense');
                      if (!category || category === 'Salary' || category === 'Debt') setCategory('Food');
                    }}
                    className={typeButtonClass(formType === 'expense', 'bg-red-500')}
                    style={formType === 'expense' ? { color: activeTypeButtonText } : undefined}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormType('income');
                      setCategory('Salary');
                    }}
                    className={typeButtonClass(formType === 'income', 'bg-gray-200')}
                    style={formType === 'income' ? { backgroundColor: theme.success, color: activeTypeButtonText } : undefined}
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
                    style={formType === 'debt' ? { color: activeTypeButtonText } : undefined}
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

              <div className={compact ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-1 gap-2 sm:flex sm:gap-3'}>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded transition disabled:opacity-60 hover:opacity-90"
                  style={{ backgroundColor: theme.primaryButtonBg, color: theme.primaryButtonText }}
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

        <div className={compact ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8'}>
          <div className={compact ? 'rounded-lg shadow-soft border px-6 py-5' : 'rounded-lg shadow-soft border p-4 sm:p-6'} style={{ backgroundColor: theme.cardBgSoft, borderColor: theme.cardBorder }}>
            <h2 className={compact ? 'text-lg mb-4' : 'text-lg sm:text-xl mb-4'} style={{ color: theme.panelTitle }}>Expenses by Category</h2>
            {expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={chartHeight}>
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={compact ? false : ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={pieOuterRadius}
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
              <div className="flex items-center justify-center" style={{ color: theme.muted, height: `${chartHeight}px` }}>No expense data yet</div>
            )}
          </div>

          <div className={compact ? 'rounded-lg shadow-soft border px-6 py-5' : 'rounded-lg shadow-soft border p-4 sm:p-6'} style={{ backgroundColor: theme.cardBgSoft, borderColor: theme.cardBorder }}>
            <h2 className={compact ? 'text-lg mb-4' : 'text-lg sm:text-xl mb-4'} style={{ color: theme.panelTitle }}>Recent Transactions</h2>
            <div className="space-y-3 max-h-96 overflow-auto">
              {normalized.slice(0, 10).map((transaction) => {
                const positive = transaction.amount > 0;
                return (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded border gap-3" style={{ backgroundColor: theme.panelRowBg, borderColor: theme.cardBorder }}>
                    <div className="flex-1">
                      <div className="font-medium" style={{ color: theme.text }}>{transaction.note || transaction.category}</div>
                      <div className="text-sm" style={{ color: theme.muted }}>
                        {transaction.category} • {transaction.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={compact ? 'text-sm font-semibold' : 'text-base sm:text-lg font-semibold'} style={{ color: positive ? theme.success : '#dc2626' }}>
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
