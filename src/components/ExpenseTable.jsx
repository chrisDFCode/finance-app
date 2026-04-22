import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Heading, Badge, Button, Center, Text } from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import { formatCurrency, formatDate } from '../utils/helpers';

function ExpenseTable({ expenses, onDelete, loading }) {
  if (expenses.length === 0) {
    return (
      <Center py={10}>
        <Text fontSize="lg" color="gray.500">No expenses yet. Add one to get started!</Text>
      </Center>
    );
  }

  return (
    <Box bg="white" p={6} borderRadius="md" boxShadow="sm" overflowX="auto">
      <Heading as="h2" size="md" mb={4}>All Expenses</Heading>
      <Table>
        <Thead>
          <Tr bg="gray.100">
            <Th>Date</Th>
            <Th>Category</Th>
            <Th>Amount</Th>
            <Th>Note</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {expenses.map(expense => (
            <Tr key={expense.id} _hover={{ bg: 'gray.50' }}>
              <Td>{formatDate(expense.date)}</Td>
              <Td>
                <Badge colorScheme="blue">{expense.category}</Badge>
              </Td>
              <Td fontWeight="semibold">{formatCurrency(expense.amount)}</Td>
              <Td color={expense.note ? 'inherit' : 'gray.400'}>{expense.note || '-'}</Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="ghost"
                  leftIcon={<FiTrash2 />}
                  onClick={() => onDelete(expense.id)}
                  isDisabled={loading}
                  title="Delete expense"
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default ExpenseTable;
