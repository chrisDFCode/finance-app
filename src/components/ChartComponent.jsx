import React, { useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { getCategoryColor, calculateCategoryTotal } from '../utils/helpers';
import '../styles/components.css';

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
      <div className="charts-container">
        <p className="no-data">No data to display. Add expenses to see charts.</p>
      </div>
    );
  }

  return (
    <div className="charts-container">
      <div className="chart-wrapper">
        <h3>Spending by Category (Bar Chart)</h3>
        <Bar data={chartData} options={chartOptions} />
      </div>

      <div className="chart-wrapper">
        <h3>Spending Distribution (Doughnut Chart)</h3>
        <Doughnut data={chartData} options={doughnutOptions} />
      </div>
    </div>
  );
}

export default ChartComponent;
