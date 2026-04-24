import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Check your .env file.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;

async function getCurrentUserId() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);
  if (!user) throw new Error('You must be signed in to continue.');

  return user.id;
}

export const authService = {
  async signUpWithEmail(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${APP_URL}/`,
      },
    });

    if (error) throw new Error(error.message);
    return data;
  },

  async signInWithEmail(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);
    return data;
  },

  async signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${APP_URL}/`,
      },
    });

    if (error) throw new Error(error.message);
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  async getSession() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw new Error(error.message);
    return data.session;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Expenses service
export const expensesService = {
  /**
   * Fetch all expenses
   */
  async fetchAll() {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Add new expense
   */
  async add(expense) {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('expenses')
      .insert([{
        user_id: userId,
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
    const userId = await getCurrentUserId();

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
  },

  /**
   * Get expenses by category
   */
  async getByCategory(category) {
    const userId = await getCurrentUserId();

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .eq('category', category)
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Get monthly summary
   */
  async getMonthlySummary(year, month) {
    const userId = await getCurrentUserId();
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 1).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lt('date', endDate)
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }
};
