import React from 'react';
import { Box, Heading, Center, Text, VStack, HStack, Badge, IconButton } from '@chakra-ui/react';
import { FiArrowUpRight, FiArrowDownRight, FiTrash2 } from 'react-icons/fi';
import { formatCurrency, formatDate } from '../utils/helpers';

function ExpenseTable({ expenses, onDelete, loading }) {
  const recentTransactions = expenses.slice(0, 6);

  if (expenses.length === 0) {
    return (
      <Box bg="#f1f2f4" p={6} borderRadius="md" border="1px solid" borderColor="#d7d9de">
        <Heading as="h3" size="md" mb={4} color="#111827">Recent Transactions</Heading>
        <Center py={10}>
          <Text fontSize="lg" color="#6b7280">No transactions yet.</Text>
        </Center>
      </Box>
    );
  }

  return (
    <Box bg="#f1f2f4" p={6} borderRadius="md" border="1px solid" borderColor="#d7d9de">
      <Heading as="h3" size="md" mb={4} color="#111827">Recent Transactions</Heading>
      <VStack spacing={3} align="stretch">
        {recentTransactions.map(transaction => {
          const amount = Number(transaction.amount);
          const isIncome = amount > 0;
          const color = isIncome ? '#16a34a' : '#ef4444';
          return (
            <HStack
              key={transaction.id}
              justify="space-between"
              bg="#e9eaed"
              px={3}
              py={2}
              borderRadius="md"
            >
              <Box>
                <HStack spacing={2}>
                  <Box color={color}>{isIncome ? <FiArrowUpRight /> : <FiArrowDownRight />}</Box>
                  <Text fontWeight="600" color="#111827">{transaction.note || transaction.category}</Text>
                </HStack>
                <HStack spacing={2} mt={1}>
                  <Badge bg="#d1d5db" color="#374151">{transaction.category}</Badge>
                  <Text fontSize="xs" color="#6b7280">{formatDate(transaction.date)}</Text>
                </HStack>
              </Box>
              <HStack spacing={2}>
                <Text fontWeight="700" color={color}>
                  {isIncome ? '+' : '-'}{formatCurrency(Math.abs(amount))}
                </Text>
                <IconButton
                  aria-label="Delete transaction"
                  icon={<FiTrash2 />}
                  size="sm"
                  variant="ghost"
                  color="#6b7280"
                  _hover={{ bg: '#d4d7dc', color: '#111827' }}
                  onClick={() => onDelete(transaction.id)}
                  isDisabled={loading}
                />
              </HStack>
            </HStack>
          );
        })}
      </VStack>
    </Box>
  );
}

export default ExpenseTable;
