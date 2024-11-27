// src/pages/HomePage.js

import React, { useState } from 'react';
import FoodCategories from '../components/FoodCategories';
import FilterOptions from '../components/FilterOptions';
import RestaurantGrid from '../components/RestaurantGrid';
import '../styles/HomePage.css';

function HomePage() {
  const [restaurants, setRestaurants] = useState([
    // Your sample restaurant data
    {
      id: 1,
      name: 'Pizza Palace',
      image: '/images/pizza-palace.jpg',
      cuisine: 'Pizza',
      rating: 4.5,
      distance: 1.2,
      priceLevel: 2, // 1: $, 2: $$, 3: $$$
    },
    {
      id: 2,
      name: 'Sushi Central',
      image: '/images/sushi-central.jpg',
      cuisine: 'Sushi',
      rating: 4.8,
      distance: 0.8,
      priceLevel: 3,
    },
    // Add more restaurants as needed
  ]);

  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants);
  const [activeFilter, setActiveFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFilters(filter, activeCategory);
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    applyFilters(activeFilter, category);
  };

  const applyFilters = (filter, category) => {
    let updatedRestaurants = [...restaurants];

    if (filter) {
      switch (filter) {
        case 'Rating':
          updatedRestaurants.sort((a, b) => b.rating - a.rating);
          break;
        case 'Distance':
          updatedRestaurants.sort((a, b) => a.distance - b.distance);
          break;
        case 'Price':
          updatedRestaurants.sort((a, b) => a.priceLevel - b.priceLevel);
          break;
        default:
          break;
      }
    }

    if (category) {
      updatedRestaurants = updatedRestaurants.filter(
        (restaurant) => restaurant.cuisine.toLowerCase() === category.toLowerCase()
      );
    }

    setFilteredRestaurants(updatedRestaurants);
  };

  return (
    <main>
      <FoodCategories onCategorySelect={handleCategorySelect} />
      <FilterOptions onFilterChange={handleFilterChange} />
      <RestaurantGrid restaurants={filteredRestaurants} />
    </main>
  );
}

export default HomePage;