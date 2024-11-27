
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
          <h3 className="restaurant-name">{restaurant.name}</h3>
          <p className="restaurant-info">
            {restaurant.cuisine} • {restaurant.rating} ⭐
          </p>
          <p className="restaurant-distance">{restaurant.distance} miles away</p>
        </div>
      ))}
    </div>
  );
}

export default RestaurantGrid;