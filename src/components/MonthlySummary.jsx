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
    <Box bg="#07130d" p={6} borderRadius="md" border="1px solid" borderColor="#165d37" boxShadow="0 12px 26px rgba(0,0,0,0.35)">
      <Heading as="h2" size="md" mb={6} color="#f2e07a">Monthly Summary - {monthName}</Heading>

      <Box bg="#0d1f15" p={4} borderRadius="md" mb={6} border="1px solid" borderColor="#1b6f42">
        <Stat>
          <StatLabel color="#b9c8bd">Total Spending</StatLabel>
          <StatNumber fontSize="2xl" color="#f2e07a">{formatCurrency(total)}</StatNumber>
          <StatHelpText color="#8fa395">{monthlyExpenses.length} transactions</StatHelpText>
        </Stat>
      </Box>

      {Object.keys(categoryTotals).length > 0 ? (
        <VStack align="stretch" spacing={3}>
          <Heading as="h4" size="sm" color="#b9c8bd">By Category</Heading>
          <Divider borderColor="#1b6f42" />
          {Object.entries(categoryTotals).map(([category, amount]) => (
            <HStack key={category} justify="space-between" px={2}>
              <Badge bg="#0a8c42" color="#f6fbf8">{category}</Badge>
              <Text fontWeight="semibold" color="#e4efe7">{formatCurrency(amount)}</Text>
            </HStack>
          ))}
        </VStack>
      ) : (
        <Text color="#8fa395" textAlign="center" py={4}>No expenses this month</Text>
      )}
    </Box>
  );
}

export default MonthlySummary;
