import React, { useMemo } from 'react';
import { Box, Heading, Center, Text } from '@chakra-ui/react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { getCategoryColor } from '../utils/helpers';

ChartJS.register(ArcElement, Tooltip, Legend);

function ChartComponent({ expenses }) {
  const categoryTotals = useMemo(() => {
    return expenses
      .filter(exp => Number(exp.amount) < 0)
      .reduce((acc, exp) => {
        const category = exp.category;
        const value = Math.abs(Number(exp.amount));
        acc[category] = (acc[category] || 0) + value;
        return acc;
      }, {});
  }, [expenses]);

  const categories = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a]);
  const amounts = categories.map(cat => categoryTotals[cat]);
  const colors = categories.map(cat => getCategoryColor(cat));

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Expenses',
        data: amounts,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 0,
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'left',
        labels: {
          color: '#0f172a',
          boxWidth: 12,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return ' ' + context.label + ': $' + context.parsed.toFixed(2);
          }
        }
      }
    }
  };

  if (categories.length === 0) {
    return (
      <Box bg="#f1f2f4" p={6} borderRadius="md" border="1px solid" borderColor="#d7d9de">
        <Heading as="h3" size="md" mb={4} color="#111827">Expenses by Category</Heading>
        <Center py={10}>
          <Text color="#6b7280" fontSize="lg">No expense data yet.</Text>
        </Center>
      </Box>
    );
  }

  return (
    <Box bg="#f1f2f4" p={6} borderRadius="md" border="1px solid" borderColor="#d7d9de">
      <Heading as="h3" size="md" mb={4} color="#111827">Expenses by Category</Heading>
      <Box h="280px">
        <Doughnut data={chartData} options={doughnutOptions} />
      </Box>
    </Box>
  );
}

export default ChartComponent;
