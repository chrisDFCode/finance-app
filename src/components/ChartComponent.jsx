import React, { useMemo } from 'react';
import { Box, Heading, SimpleGrid, Center, Text } from '@chakra-ui/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { getCategoryColor, calculateCategoryTotal } from '../utils/helpers';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

function ChartComponent({ expenses }) {
  const categoryTotals = useMemo(() => {
    return calculateCategoryTotal(expenses);
  }, [expenses]);

  const categories = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a]);
  const amounts = categories.map(cat => categoryTotals[cat]);
  const colors = categories.map(cat => getCategoryColor(cat));

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Amount Spent',
        data: amounts,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return '$' + context.parsed.y.toFixed(2);
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return '$' + context.parsed.toFixed(2);
          }
        }
      }
    }
  };

  if (categories.length === 0) {
    return (
      <Center py={10}>
        <Text color="gray.500" fontSize="lg">No data to display. Add expenses to see charts.</Text>
      </Center>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
      <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
        <Heading as="h3" size="md" mb={4}>Spending by Category (Bar Chart)</Heading>
        <Bar data={chartData} options={chartOptions} />
      </Box>

      <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
        <Heading as="h3" size="md" mb={4}>Spending Distribution (Doughnut Chart)</Heading>
        <Doughnut data={chartData} options={doughnutOptions} />
      </Box>
    </SimpleGrid>
  );
}

export default ChartComponent;
