import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Heading, Alert, VStack, SimpleGrid, HStack } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Shopping', 'Education', 'Salary', 'Debt', 'Other'];

function AddExpenseForm({ onAddExpense, loading, onCancel }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
    note: ''
  });

  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError('');
  };

  const validateForm = () => {
    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
      setFormError('Please enter a valid amount');
      return false;
    }
    if (!formData.date) {
      setFormError('Please select a date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const value = Math.abs(parseFloat(formData.amount));
      const amount = formData.type === 'income' ? value : -value;

      await onAddExpense({
        amount,
        category: formData.category,
        date: formData.date,
        note: formData.note
      });

      setFormData({
        type: 'expense',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        note: ''
      });
    } catch (error) {
      setFormError(error.message);
    }
  };

  return (
    <Box bg="#f1f2f4" p={2}>
      <Heading as="h2" size="md" mb={4} color="#0f172a">New Transaction</Heading>

      {formError && (
        <Alert status="error" mb={4} borderRadius="md">
          {formError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl>
            <FormLabel color="#1f2937">Type</FormLabel>
            <HStack spacing={2}>
              <Button
                size="sm"
                bg={formData.type === 'expense' ? '#ef4444' : '#d1d5db'}
                color={formData.type === 'expense' ? 'white' : '#111827'}
                _hover={{ bg: formData.type === 'expense' ? '#dc2626' : '#c7ccd4' }}
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                type="button"
              >
                Expense
              </Button>
              <Button
                size="sm"
                bg={formData.type === 'income' ? '#16a34a' : '#d1d5db'}
                color={formData.type === 'income' ? 'white' : '#111827'}
                _hover={{ bg: formData.type === 'income' ? '#15803d' : '#c7ccd4' }}
                onClick={() => setFormData(prev => ({ ...prev, type: 'income', category: 'Salary' }))}
                type="button"
              >
                Income
              </Button>
              <Button
                size="sm"
                bg={formData.type === 'debt' ? '#f59e0b' : '#d1d5db'}
                color={formData.type === 'debt' ? 'white' : '#111827'}
                _hover={{ bg: formData.type === 'debt' ? '#d97706' : '#c7ccd4' }}
                onClick={() => setFormData(prev => ({ ...prev, type: 'debt', category: 'Debt' }))}
                type="button"
              >
                Debt
              </Button>
            </HStack>
          </FormControl>

          <SimpleGrid columns={{ base: 1, sm: 2 }} width="100%" spacing={4}>
            <FormControl>
              <FormLabel color="#1f2937">Amount</FormLabel>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                isDisabled={loading}
                bg="white"
                color="#111827"
                borderColor="#cfd4dc"
                _placeholder={{ color: '#9ca3af' }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="#1f2937">Category</FormLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                isDisabled={loading}
                bg="white"
                color="#111827"
                borderColor="#cfd4dc"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, sm: 2 }} width="100%" spacing={4}>
            <FormControl>
              <FormLabel color="#1f2937">Date</FormLabel>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                isDisabled={loading}
                bg="white"
                color="#111827"
                borderColor="#cfd4dc"
              />
            </FormControl>

            <FormControl>
              <FormLabel color="#1f2937">Description</FormLabel>
              <Input
                type="text"
                placeholder="Enter description"
                name="note"
                value={formData.note}
                onChange={handleChange}
                isDisabled={loading}
                bg="white"
                color="#111827"
                borderColor="#cfd4dc"
                _placeholder={{ color: '#9ca3af' }}
              />
            </FormControl>
          </SimpleGrid>

          <HStack width="100%" justify="flex-start">
            <Button
              type="submit"
              colorScheme="blue"
              leftIcon={<FiPlus />}
              isLoading={loading}
              loadingText="Adding..."
            >
              Add Transaction
            </Button>
            {onCancel && (
              <Button type="button" bg="#d1d5db" color="#1f2937" _hover={{ bg: '#c7ccd4' }} onClick={onCancel}>
                Cancel
              </Button>
            )}
          </HStack>
        </VStack>
      </form>
    </Box>
  );
}

export default AddExpenseForm;
