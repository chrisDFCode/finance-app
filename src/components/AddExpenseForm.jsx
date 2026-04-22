import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Select, Heading, Alert, VStack, SimpleGrid } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Shopping', 'Education', 'Other'];

function AddExpenseForm({ onAddExpense, loading }) {
  const [formData, setFormData] = useState({
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
      await onAddExpense({
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        note: formData.note
      });

      setFormData({
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
    <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
      <Heading as="h2" size="md" mb={4}>Add New Expense</Heading>

      {formError && (
        <Alert status="error" mb={4} borderRadius="md">
          {formError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <SimpleGrid columns={{ base: 1, sm: 2 }} width="100%" spacing={4}>
            <FormControl>
              <FormLabel>Amount ($)</FormLabel>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                isDisabled={loading}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Category</FormLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                isDisabled={loading}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, sm: 2 }} width="100%" spacing={4}>
            <FormControl>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                isDisabled={loading}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Note (Optional)</FormLabel>
              <Input
                type="text"
                placeholder="Add a note..."
                name="note"
                value={formData.note}
                onChange={handleChange}
                isDisabled={loading}
              />
            </FormControl>
          </SimpleGrid>

          <Button
            type="submit"
            colorScheme="blue"
            width="100%"
            leftIcon={<FiPlus />}
            isLoading={loading}
            loadingText="Adding..."
          >
            Add Expense
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default AddExpenseForm;
