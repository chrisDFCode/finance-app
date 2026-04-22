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
        labels: {
          color: '#c6d4cb',
        }
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
        grid: {
          color: 'rgba(185, 200, 189, 0.2)'
        },
        ticks: {
          color: '#9cb1a2',
          callback: function(value) {
            return '$' + value.toFixed(2);
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(185, 200, 189, 0.1)'
        },
        ticks: {
          color: '#9cb1a2'
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
        labels: {
          color: '#c6d4cb',
        }
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
        <Text color="#8fa395" fontSize="lg">No data to display. Add expenses to see charts.</Text>
      </Center>
    );
  }

  return (
    <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
      <Box bg="#07130d" p={6} borderRadius="md" border="1px solid" borderColor="#165d37" boxShadow="0 12px 26px rgba(0,0,0,0.35)">
        <Heading as="h3" size="md" mb={4} color="#f2e07a">Spending by Category (Bar Chart)</Heading>
        <Bar data={chartData} options={chartOptions} />
      </Box>

      <Box bg="#07130d" p={6} borderRadius="md" border="1px solid" borderColor="#165d37" boxShadow="0 12px 26px rgba(0,0,0,0.35)">
        <Heading as="h3" size="md" mb={4} color="#f2e07a">Spending Distribution (Doughnut Chart)</Heading>
        <Doughnut data={chartData} options={doughnutOptions} />
      </Box>
    </SimpleGrid>
  );
}

export default ChartComponent;
