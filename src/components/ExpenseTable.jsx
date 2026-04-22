import React from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Heading, Badge, Button, Center, Text } from '@chakra-ui/react';
import { FiTrash2 } from 'react-icons/fi';
import { formatCurrency, formatDate } from '../utils/helpers';

function ExpenseTable({ expenses, onDelete, loading }) {
  if (expenses.length === 0) {
    return (
      <Center py={10}>
        <Text fontSize="lg" color="#8fa395">No expenses yet. Add one to get started!</Text>
      </Center>
    );
  }

  return (
    <Box bg="#07130d" p={6} borderRadius="md" border="1px solid" borderColor="#165d37" boxShadow="0 12px 26px rgba(0,0,0,0.35)" overflowX="auto">
      <Heading as="h2" size="md" mb={4} color="#f2e07a">All Expenses</Heading>
      <Table>
        <Thead>
          <Tr bg="#0d1f15">
            <Th color="#b9c8bd">Date</Th>
            <Th color="#b9c8bd">Category</Th>
            <Th color="#b9c8bd">Amount</Th>
            <Th color="#b9c8bd">Note</Th>
            <Th color="#b9c8bd">Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {expenses.map((expense, index) => (
            <Tr key={expense.id} bg={index % 2 === 0 ? '#08170f' : '#0a1b12'} _hover={{ bg: '#12301f' }}>
              <Td color="#e4efe7">{formatDate(expense.date)}</Td>
              <Td>
                <Badge bg="#0a8c42" color="#f6fbf8">{expense.category}</Badge>
              </Td>
              <Td fontWeight="semibold" color="#f2e07a">{formatCurrency(expense.amount)}</Td>
              <Td color={expense.note ? '#d7e5dc' : '#6f8678'}>{expense.note || '-'}</Td>
              <Td>
                <Button
                  size="sm"
                  bg="#3a0f0f"
                  color="#ffd7d7"
                  _hover={{ bg: '#4d1616' }}
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
