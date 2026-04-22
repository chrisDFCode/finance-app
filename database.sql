-- Finance App Database Schema
-- Create the expenses table with proper constraints and indexes

-- Create the expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id BIGSERIAL PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at);

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_expenses_updated_at ON expenses;
CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (optional but recommended)
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Demo policies for client-side app using anon key.
-- In production with auth, replace these with user-scoped policies.
DROP POLICY IF EXISTS "Allow read expenses" ON expenses;
DROP POLICY IF EXISTS "Allow insert expenses" ON expenses;
DROP POLICY IF EXISTS "Allow update expenses" ON expenses;
DROP POLICY IF EXISTS "Allow delete expenses" ON expenses;

CREATE POLICY "Allow read expenses"
  ON expenses FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert expenses"
  ON expenses FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update expenses"
  ON expenses FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow delete expenses"
  ON expenses FOR DELETE
  TO anon, authenticated
  USING (true);

-- Insert sample data (optional - for testing)
-- INSERT INTO expenses (amount, category, date, note) VALUES
-- (25.50, 'Food', '2024-04-01', 'Lunch at cafe'),
-- (50.00, 'Transport', '2024-04-02', 'Uber ride'),
-- (120.00, 'Entertainment', '2024-04-03', 'Movie tickets'),
-- (30.00, 'Food', '2024-04-04', 'Dinner'),
-- (45.00, 'Utilities', '2024-04-05', 'Electric bill');
