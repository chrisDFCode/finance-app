import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Expenses service
export const expensesService = {
  /**
   * Fetch all expenses
   */
  async fetchAll() {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Add new expense
   */
  async add(expense) {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        amount: expense.amount,
        category: expense.category,
        date: expense.date,
        note: expense.note || null,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) throw new Error(error.message);
    return data[0];
  },

  /**
   * Delete expense
   */
  async delete(id) {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  /**
   * Get expenses by category
   */
  async getByCategory(category) {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('category', category)
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Get monthly summary
   */
  async getMonthlySummary(year, month) {
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 1).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .gte('date', startDate)
      .lt('date', endDate)
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }
};
