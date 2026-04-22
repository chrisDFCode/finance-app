import React, { useEffect, useState } from 'react';
import { Box, Stat, StatLabel, StatNumber, StatHelpText, SimpleGrid } from '@chakra-ui/react';
import { formatCurrency, calculateTotal } from '../utils/helpers';

function StatsSection({ expenses, loading }) {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(calculateTotal(expenses));
  }, [expenses]);

  return (
    <SimpleGrid columns={{ base: 1 }} spacing={4}>
      <Box bg="linear-gradient(135deg, #0d5a33 0%, #0b3f25 100%)" p={6} borderRadius="md" border="1px solid" borderColor="#1c8f55" color="white">
        <Stat>
          <StatLabel fontSize="md" opacity={0.9}>Total Spending</StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold">{formatCurrency(total)}</StatNumber>
          <StatHelpText color="whiteAlpha.800">{expenses.length} transactions</StatHelpText>
        </Stat>
      </Box>

      <Box bg="linear-gradient(135deg, #133124 0%, #0c2219 100%)" p={6} borderRadius="md" border="1px solid" borderColor="#246a47" color="#f2e07a">
        <Stat>
          <StatLabel fontSize="md" opacity={0.9}>Average Per Transaction</StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold">
            {expenses.length > 0
              ? formatCurrency(total / expenses.length)
              : formatCurrency(0)}
          </StatNumber>
        </Stat>
      </Box>

      <Box bg="linear-gradient(135deg, #2f2a11 0%, #1f1b0d 100%)" p={6} borderRadius="md" border="1px solid" borderColor="#5f5530" color="#f2e07a">
        <Stat>
          <StatLabel fontSize="md" opacity={0.9}>Total Transactions</StatLabel>
          <StatNumber fontSize="3xl" fontWeight="bold">{expenses.length}</StatNumber>
        </Stat>
      </Box>
    </SimpleGrid>
  );
}

export default StatsSection;
