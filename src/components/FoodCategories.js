// src/components/FoodCategories.js

import React, { useState } from 'react';
import '../styles/FoodCategories.css';

/**
 * FoodCategories Component
 * 
 * Renders a list of food categories that users can select to filter restaurants.
 * When a category is selected, it passes the associated keyword to the parent component.
 * 
 * Props:
 * - onCategorySelect (function): Callback function to notify parent of selected category keyword.
 */
function FoodCategories({ onCategorySelect }) {
  // Define the list of food categories with associated keywords
  const categories = [
    { name: 'Pizza', icon: '🍕', keyword: 'pizza' },
    { name: 'Sushi', icon: '🍣', keyword: 'sushi' },
    { name: 'Burgers', icon: '🍔', keyword: 'burger' },
    { name: 'Salads', icon: '🥗', keyword: 'salad' },
    { name: 'Desserts', icon: '🍰', keyword: 'dessert' },
    { name: 'Mexican', icon: '🌮', keyword: 'mexican' },
    { name: 'Chinese', icon: '🥡', keyword: 'chinese' },
    { name: 'Indian', icon: '🍛', keyword: 'indian' },
    { name: 'Thai', icon: '🍜', keyword: 'thai' },
    { name: 'Vegan', icon: '🌱', keyword: 'vegan' },
    // Add more categories as needed
  ];

  // State to track the currently active (selected) category name
  const [activeCategoryName, setActiveCategoryName] = useState('');

  /**
   * Handles the click event on a category button.
   * Toggles the active category and notifies the parent component with the keyword.
   * 
   * @param {Object} category - The category object containing name, icon, and keyword.
   */
  const handleClick = (category) => {
    if (activeCategoryName === category.name) {
      // If the clicked category is already active, deactivate it
      setActiveCategoryName('');
      if (onCategorySelect) {
        onCategorySelect(null); // Notify parent to reset filters
      }
    } else {
      // Activate the clicked category
      setActiveCategoryName(category.name);
      if (onCategorySelect) {
        onCategorySelect(category.keyword); // Notify parent with the selected keyword
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
            className={`category-item ${activeCategoryName === category.name ? 'active' : ''}`}
            onClick={() => handleClick(category)}
            aria-pressed={activeCategoryName === category.name}
            aria-label={`Filter by ${category.name}`}
          >
            <span className="category-icon" role="img" aria-label={`${category.name} icon`}>
              {category.icon}
            </span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default FoodCategories;