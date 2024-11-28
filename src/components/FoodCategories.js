// src/components/FoodCategories.js

import React, { useState } from 'react';
import '../styles/FoodCategories.css';

function FoodCategories({ onCategorySelect }) {
  const categories = [
    { name: 'Pizza', icon: '🍕' },
    { name: 'Sushi', icon: '🍣' },
    { name: 'Burgers', icon: '🍔' },
    { name: 'Salads', icon: '🥗' },
    { name: 'Desserts', icon: '🍰' },
    // Add more categories as needed
  ];

  const [activeCategory, setActiveCategory] = useState('');

  const handleClick = (categoryName) => {
    if (activeCategory === categoryName) {
      setActiveCategory('');
      if (onCategorySelect) {
        onCategorySelect(null); // Inform parent to reset filters if applicable
      }
    } else {
      setActiveCategory(categoryName);
      if (onCategorySelect) {
        onCategorySelect(categoryName); // Inform parent about the selected category
      }
    }
  };

  return (
    <div className="food-categories-container">
      <span className="categories-label">Categories</span>
      <div className="food-categories">
        {categories.map((category) => (
          <button
            key={category.name}
            className={`category-item ${activeCategory === category.name ? 'active' : ''}`}
            onClick={() => handleClick(category.name)}
            aria-pressed={activeCategory === category.name}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FoodCategories;