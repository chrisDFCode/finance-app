import React, { useEffect } from 'react';
import { Box, Container, Heading, Text, Alert, CloseButton, SimpleGrid, Spinner, Center } from '@chakra-ui/react';
import AddExpenseForm from '../components/AddExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import CategoryFilter from '../components/CategoryFilter';
import MonthlySummary from '../components/MonthlySummary';
import ChartComponent from '../components/ChartComponent';
import StatsSection from '../components/StatsSection';
import { useExpenses, useFilter } from '../hooks/useExpenses';
import { expensesService } from '../services/supabaseClient';

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
      setError(err?.message || 'Failed to load expenses. Please try again.');
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
      setError(err?.message || 'Failed to add expense. Please try again.');
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
      setError(err?.message || 'Failed to delete expense. Please try again.');
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
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)" color="white" py={8} mb={8}>
        <Container maxW="1200px">
          <Heading as="h1" size="2xl">💰 Finance Tracker</Heading>
          <Text fontSize="lg" mt={2} opacity={0.9}>Manage your expenses and track your spending</Text>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="1200px" pb={10}>
        {/* Error Alert */}
        {error && (
          <Alert status="error" mb={6} borderRadius="md">
            {error}
            <CloseButton ml="auto" onClick={() => setError(null)} />
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Center py={10}>
            <Spinner size="lg" color="blue.500" />
          </Center>
        )}

        {!loading && (
          <>
            {/* Left and Right Columns */}
            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
              {/* Left Column */}
              <Box>
                <AddExpenseForm onAddExpense={handleAddExpense} loading={loading} />
                <Box mt={6}>
                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </Box>
              </Box>

              {/* Right Column */}
              <Box>
                <StatsSection expenses={filteredExpenses} loading={loading} />
                <Box mt={6}>
                  <MonthlySummary expenses={filteredExpenses} />
                </Box>
              </Box>
            </SimpleGrid>

            {/* Full Width Sections */}
            <Box mb={8}>
              <ChartComponent expenses={filteredExpenses} />
            </Box>

            <Box>
              <ExpenseTable
                expenses={filteredExpenses}
                onDelete={handleDeleteExpense}
                loading={loading}
              />
            </Box>
          </>
        )}
      </Container>

      {/* Footer */}
      <Box bg="gray.200" py={4} mt={10} textAlign="center">
        <Text>&copy; 2024 Finance Tracker. Built with React & Supabase.</Text>
      </Box>
    </Box>
  );
}

export default Dashboard;
