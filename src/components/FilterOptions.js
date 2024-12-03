// src/components/FilterOptions.js

import React, { useState } from 'react';
import '../styles/FilterOptions.css';

function FilterOptions({ onFilterChange }) {
  const filters = ['Rating', 'Distance', 'Price'];
  const [activeFilter, setActiveFilter] = useState('');

  const handleClick = (filter) => {
    if (activeFilter === filter) {
      // If the clicked filter is already active, unselect it
      setActiveFilter('');
      onFilterChange(null); // Notify parent that no filter is active
    } else {
      // Otherwise, set the clicked filter as active
      setActiveFilter(filter);
      onFilterChange(filter);
    }
  };

  return (
    <div className="filter-options-container">
      <span className="filters-label">Filters</span>
      <div className="filter-options">
        {filters.map((filter) => (
          <button
            key={filter}
            className={`filter-button ${activeFilter === filter ? 'active' : ''}`}
            onClick={() => handleClick(filter)}
            aria-pressed={activeFilter === filter} // Accessibility attribute
            aria-label={`Filter by ${filter}`} // Accessibility label
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterOptions;