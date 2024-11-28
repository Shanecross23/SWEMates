// src/components/RestaurantGrid.js

import React from 'react';
import '../styles/RestaurantGrid.css';

function RestaurantGrid({ restaurants }) {
  return (
    <div className="restaurant-grid">
      {restaurants.map((restaurant) => (
        <div key={restaurant.id} className="restaurant-card">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="restaurant-image"
          />
          <div className="restaurant-info">
            <h3>{restaurant.name}</h3>
            <p>Cuisine: {restaurant.cuisine}</p>
            <p>Rating: {restaurant.rating}</p>
            <p>Distance: {restaurant.distance} km</p>
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