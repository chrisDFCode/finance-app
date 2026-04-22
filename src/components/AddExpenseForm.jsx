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
    <Box bg="#07130d" p={6} borderRadius="md" border="1px solid" borderColor="#165d37" boxShadow="0 12px 26px rgba(0,0,0,0.35)">
      <Heading as="h2" size="md" mb={4} color="#f2e07a">Add New Expense</Heading>

      {formError && (
        <Alert status="error" mb={4} borderRadius="md" bg="#3a0f0f" color="#ffd7d7" border="1px solid" borderColor="#6d1f1f">
          {formError}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <SimpleGrid columns={{ base: 1, sm: 2 }} width="100%" spacing={4}>
            <FormControl>
              <FormLabel color="#b9c8bd">Amount</FormLabel>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                isDisabled={loading}
                bg="#0d1f15"
                color="#e4efe7"
                borderColor="#1b6f42"
                _placeholder={{ color: '#7d9986' }}
                _hover={{ borderColor: '#2f9e62' }}
                _focusVisible={{ borderColor: '#3ebf78', boxShadow: '0 0 0 1px #3ebf78' }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="#b9c8bd">Category</FormLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                isDisabled={loading}
                bg="#0d1f15"
                color="#e4efe7"
                borderColor="#1b6f42"
                _hover={{ borderColor: '#2f9e62' }}
                _focusVisible={{ borderColor: '#3ebf78', boxShadow: '0 0 0 1px #3ebf78' }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Select>
            </FormControl>
          </SimpleGrid>

          <SimpleGrid columns={{ base: 1, sm: 2 }} width="100%" spacing={4}>
            <FormControl>
              <FormLabel color="#b9c8bd">Date</FormLabel>
              <Input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                isDisabled={loading}
                bg="#0d1f15"
                color="#e4efe7"
                borderColor="#1b6f42"
                _hover={{ borderColor: '#2f9e62' }}
                _focusVisible={{ borderColor: '#3ebf78', boxShadow: '0 0 0 1px #3ebf78' }}
              />
            </FormControl>

            <FormControl>
              <FormLabel color="#b9c8bd">Note (Optional)</FormLabel>
              <Input
                type="text"
                placeholder="Add a note..."
                name="note"
                value={formData.note}
                onChange={handleChange}
                isDisabled={loading}
                bg="#0d1f15"
                color="#e4efe7"
                borderColor="#1b6f42"
                _placeholder={{ color: '#7d9986' }}
                _hover={{ borderColor: '#2f9e62' }}
                _focusVisible={{ borderColor: '#3ebf78', boxShadow: '0 0 0 1px #3ebf78' }}
              />
            </FormControl>
          </SimpleGrid>

          <Button
            type="submit"
            bg="#0a8c42"
            color="#f4f7f5"
            _hover={{ bg: '#087639' }}
            _active={{ bg: '#066430' }}
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
