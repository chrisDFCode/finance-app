import React, { useMemo } from 'react';
import { Box, Heading, Stat, StatLabel, StatNumber, StatHelpText, VStack, HStack, Divider, Text, Badge } from '@chakra-ui/react';
import { formatCurrency, calculateCategoryTotal } from '../utils/helpers';

function MonthlySummary({ expenses, month = null, year = null }) {
  const now = new Date();
  const selectedMonth = month || now.getMonth() + 1;
  const selectedYear = year || now.getFullYear();

  const monthlyExpenses = useMemo(() => {
    const startDate = new Date(selectedYear, selectedMonth - 1, 1);
    const endDate = new Date(selectedYear, selectedMonth, 1);

    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate < endDate;
    });
  }, [expenses, selectedMonth, selectedYear]);

  const total = useMemo(() => {
    return monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [monthlyExpenses]);

  const categoryTotals = useMemo(() => {
    return calculateCategoryTotal(monthlyExpenses);
  }, [monthlyExpenses]);

  const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
      <Heading as="h2" size="md" mb={6}>Monthly Summary - {monthName}</Heading>

      <Box bg="gray.50" p={4} borderRadius="md" mb={6}>
        <Stat>
          <StatLabel>Total Spending</StatLabel>
          <StatNumber fontSize="2xl">{formatCurrency(total)}</StatNumber>
          <StatHelpText>{monthlyExpenses.length} transactions</StatHelpText>
        </Stat>
      </Box>

      {Object.keys(categoryTotals).length > 0 ? (
        <VStack align="stretch" spacing={3}>
          <Heading as="h4" size="sm">By Category</Heading>
          <Divider />
          {Object.entries(categoryTotals).map(([category, amount]) => (
            <HStack key={category} justify="space-between" px={2}>
              <Badge colorScheme="blue">{category}</Badge>
              <Text fontWeight="semibold">{formatCurrency(amount)}</Text>
            </HStack>
          ))}
        </VStack>
      ) : (
        <Text color="gray.500" textAlign="center" py={4}>No expenses this month</Text>
      )}
    </Box>
  );
}

export default MonthlySummary;
