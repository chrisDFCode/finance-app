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

-- Create a policy to allow authenticated users to see their own expenses
-- (This assumes you have user_id column - commented out for this simple version)
-- CREATE POLICY "Users can see their own expenses"
--   ON expenses FOR SELECT
--   USING (auth.uid() = user_id);

-- Create a policy to allow authenticated users to insert expenses
-- CREATE POLICY "Users can insert their own expenses"
--   ON expenses FOR INSERT
--   WITH CHECK (auth.uid() = user_id);

-- Create a policy to allow authenticated users to update their own expenses
-- CREATE POLICY "Users can update their own expenses"
--   ON expenses FOR UPDATE
--   USING (auth.uid() = user_id)
--   WITH CHECK (auth.uid() = user_id);

-- Create a policy to allow authenticated users to delete their own expenses
-- CREATE POLICY "Users can delete their own expenses"
--   ON expenses FOR DELETE
--   USING (auth.uid() = user_id);

-- Insert sample data (optional - for testing)
-- INSERT INTO expenses (amount, category, date, note) VALUES
-- (25.50, 'Food', '2024-04-01', 'Lunch at cafe'),
-- (50.00, 'Transport', '2024-04-02', 'Uber ride'),
-- (120.00, 'Entertainment', '2024-04-03', 'Movie tickets'),
-- (30.00, 'Food', '2024-04-04', 'Dinner'),
-- (45.00, 'Utilities', '2024-04-05', 'Electric bill');
