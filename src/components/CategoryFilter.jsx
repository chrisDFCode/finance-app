import React from 'react';
import '../styles/components.css';

const CATEGORIES = ['All', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Health', 'Shopping', 'Education', 'Other'];

function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <div className="category-filter">
      <h3>Filter by Category</h3>
      <div className="filter-buttons">
        {CATEGORIES.map(category => (
          <button
            key={category}
            className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CategoryFilter;
