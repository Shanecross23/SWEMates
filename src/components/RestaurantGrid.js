// src/components/RestaurantGrid.js

import React from 'react';
import '../styles/RestaurantGrid.css';

/**
 * RestaurantGrid Component
 *
 * Displays a grid of restaurant cards.
 *
 * Props:
 * - restaurants (array): List of restaurant objects to display.
 * - onRestaurantClick (function): Function to handle when a restaurant card is clicked.
 */
function RestaurantGrid({ restaurants, onRestaurantClick }) {
  return (
    <div className="restaurant-grid">
      {restaurants.map((restaurant) => (
        <div
          key={restaurant.id}
          className="restaurant-card"
          onClick={() => onRestaurantClick(restaurant)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === 'Enter') onRestaurantClick(restaurant);
          }}
        >
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="restaurant-image"
          />
          <div className="restaurant-info">
            <h3>{restaurant.name}</h3>
            <p>Cuisine: {restaurant.cuisine}</p>
            <p>Rating: {restaurant.rating}</p>
            <p>Distance: {restaurant.distance ? `${restaurant.distance.toFixed(2)} km` : 'N/A'}</p>
            <p>
              Price:{' '}
              {restaurant.priceLevel === 0
                ? 'N/A'
                : '$'.repeat(restaurant.priceLevel)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RestaurantGrid;