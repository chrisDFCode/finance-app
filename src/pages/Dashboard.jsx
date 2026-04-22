import React, { useEffect, useMemo, useState } from 'react';
import { Box, Container, Heading, Text, Alert, CloseButton, SimpleGrid, Spinner, Center, HStack, Image, Button, VStack, Icon } from '@chakra-ui/react';
import { FiPlusCircle, FiCreditCard, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import AddExpenseForm from '../components/AddExpenseForm';
import ExpenseTable from '../components/ExpenseTable';
import ChartComponent from '../components/ChartComponent';
import { useExpenses } from '../hooks/useExpenses';
import { formatCurrency } from '../utils/helpers';
import { expensesService } from '../services/supabaseClient';

function Dashboard() {
  const { expenses, setExpensesData, addExpense, removeExpense, setLoading, loading, error, setError } = useExpenses();
  const [showForm, setShowForm] = useState(false);

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

  const totalIncome = useMemo(
    () => expenses.filter(exp => Number(exp.amount) > 0).reduce((sum, exp) => sum + Number(exp.amount), 0),
    [expenses]
  );

  const totalExpenses = useMemo(
    () => expenses.filter(exp => Number(exp.amount) < 0).reduce((sum, exp) => sum + Math.abs(Number(exp.amount)), 0),
    [expenses]
  );

  const totalBalance = useMemo(() => totalIncome - totalExpenses, [totalIncome, totalExpenses]);

  return (
    <Box minH="100vh" bg="#e8e8ea">
      {/* Header */}
      <Box
        bg="#e8e8ea"
        color="#0f172a"
        py={6}
      >
        <Container maxW="1200px" px={{ base: 4, md: 6 }}>
          <HStack spacing={4} align="center">
            <Image
              src="/barya-logo.png"
              alt="Barya logo"
              boxSize={{ base: '32px', md: '40px' }}
              objectFit="contain"
              fallbackSrc=""
            />
            <Box>
              <Heading as="h1" size="lg" letterSpacing="tight">Barya</Heading>
              <Text fontSize="sm" color="#4b5563">Track and manage your expenses</Text>
            </Box>
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="1200px" pb={10} px={{ base: 4, md: 6 }}>
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
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
              <Box bg="#f1f2f4" border="1px solid" borderColor="#d7d9de" borderRadius="md" p={5}>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="md" color="#1f2937">Total Balance</Text>
                  <Icon as={FiCreditCard} color="#2563eb" />
                </HStack>
                <Text fontSize="3xl" fontWeight="bold" color={totalBalance >= 0 ? '#059669' : '#dc2626'}>{formatCurrency(totalBalance)}</Text>
              </Box>

              <Box bg="#f1f2f4" border="1px solid" borderColor="#d7d9de" borderRadius="md" p={5}>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="md" color="#1f2937">Total Income</Text>
                  <Icon as={FiTrendingUp} color="#16a34a" />
                </HStack>
                <Text fontSize="3xl" fontWeight="bold" color="#16a34a">{formatCurrency(totalIncome)}</Text>
              </Box>

              <Box bg="#f1f2f4" border="1px solid" borderColor="#d7d9de" borderRadius="md" p={5}>
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="md" color="#1f2937">Total Expenses</Text>
                  <Icon as={FiTrendingDown} color="#ef4444" />
                </HStack>
                <Text fontSize="3xl" fontWeight="bold" color="#ef4444">{formatCurrency(totalExpenses)}</Text>
              </Box>
            </SimpleGrid>

            <VStack align="stretch" spacing={4} mb={6}>
              <Box>
                <Button
                  leftIcon={<FiPlusCircle />}
                  colorScheme="blue"
                  borderRadius="md"
                  onClick={() => setShowForm(prev => !prev)}
                >
                  {showForm ? 'Hide Transaction Form' : 'Add Transaction'}
                </Button>
              </Box>

              {showForm && (
                <Box bg="#f1f2f4" border="1px solid" borderColor="#d7d9de" borderRadius="md" p={4}>
                  <AddExpenseForm onAddExpense={handleAddExpense} loading={loading} onCancel={() => setShowForm(false)} />
                </Box>
              )}
            </VStack>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              <Box>
                <ChartComponent expenses={expenses} />
              </Box>

              <Box>
              <ExpenseTable
                expenses={expenses}
                onDelete={handleDeleteExpense}
                loading={loading}
              />
              </Box>
            </SimpleGrid>
          </>
        )}
      </Container>

      {/* Footer */}
      <Box py={4} mt={10} textAlign="center">
        <Text color="#6b7280">&copy; 2026 Barya Finance. Built with React & Supabase.</Text>
      </Box>
    </Box>
  );
}

export default Dashboard;
