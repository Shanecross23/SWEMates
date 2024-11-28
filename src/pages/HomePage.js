// src/pages/HomePage.js

import React, { useEffect, useState } from 'react';
import FoodCategories from '../components/FoodCategories';
import FilterOptions from '../components/FilterOptions';
import RestaurantGrid from '../components/RestaurantGrid';
import '../styles/HomePage.css';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

function HomePage() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [activeFilter, setActiveFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  useEffect(() => {
    if (!isLoaded) return;

    const fetchRestaurants = () => {
      try {
        const address = localStorage.getItem('userAddress');
        if (!address) {
          throw new Error('No address found. Please enter your address.');
        }

        const geocoder = new window.google.maps.Geocoder();

        // Geocode the address to get latitude and longitude
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            const lat = location.lat();
            const lng = location.lng();

            // Use PlacesService to find nearby restaurants
            const map = new window.google.maps.Map(document.createElement('div'));
            const service = new window.google.maps.places.PlacesService(map);

            const request = {
              location: location,
              radius: 5000,
              type: ['restaurant'],
            };

            service.nearbySearch(request, (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                // Process results and update state
                const fetchedRestaurants = results.map((place) => ({
                  id: place.place_id,
                  name: place.name,
                  image: place.photos
                    ? place.photos[0].getUrl({ maxWidth: 400 })
                    : '/images/default-restaurant.jpg',
                  cuisine:
                    place.types && place.types.length > 0
                      ? place.types[0].replace('_', ' ').toUpperCase()
                      : 'Unknown',
                  rating: place.rating || 'N/A',
                  distance: null, // We'll calculate this later
                  distanceText: '',
                  durationText: '',
                  priceLevel: place.price_level || 0,
                  geometry: place.geometry,
                  location: place.geometry.location,
                }));

                // Calculate distances
                const origins = [location];
                const destinations = fetchedRestaurants.map(
                  (restaurant) => restaurant.location
                );

                const distanceMatrixService =
                  new window.google.maps.DistanceMatrixService();

                distanceMatrixService.getDistanceMatrix(
                  {
                    origins: origins,
                    destinations: destinations,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                    unitSystem: window.google.maps.UnitSystem.METRIC,
                  },
                  (response, status) => {
                    if (status === 'OK') {
                      const distanceElements = response.rows[0].elements;
                      const restaurantsWithDistances = fetchedRestaurants.map(
                        (restaurant, index) => {
                          const distanceElement = distanceElements[index];
                          return {
                            ...restaurant,
                            distance:
                              distanceElement.status === 'OK'
                                ? distanceElement.distance.value / 1000 // Convert meters to kilometers
                                : null,
                            distanceText:
                              distanceElement.status === 'OK'
                                ? distanceElement.distance.text
                                : 'N/A',
                            durationText:
                              distanceElement.status === 'OK'
                                ? distanceElement.duration.text
                                : 'N/A',
                          };
                        }
                      );

                      setRestaurants(restaurantsWithDistances);
                      setFilteredRestaurants(restaurantsWithDistances);
                      setLoading(false);
                    } else {
                      throw new Error(
                        `Distance Matrix request failed: ${status}`
                      );
                    }
                  }
                );
              } else {
                throw new Error(`Places request failed: ${status}`);
              }
            });
          } else {
            throw new Error(`Geocode was not successful: ${status}`);
          }
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [isLoaded]);

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

    // Filter by category first if selected
    if (category) {
      updatedRestaurants = updatedRestaurants.filter(
        (restaurant) =>
          restaurant.cuisine.toLowerCase() === category.toLowerCase()
      );
    }

    // Then apply sorting
    if (filter) {
      switch (filter) {
        case 'Rating':
          updatedRestaurants.sort((a, b) => b.rating - a.rating);
          break;
        case 'Distance':
          // Handle null distances by placing them at the end
          updatedRestaurants.sort((a, b) => {
            if (a.distance === null) return 1;
            if (b.distance === null) return -1;
            return a.distance - b.distance;
          });
          break;
        case 'Price':
          updatedRestaurants.sort((a, b) => a.priceLevel - b.priceLevel);
          break;
        default:
          break;
      }
    }

    setFilteredRestaurants(updatedRestaurants);
  };

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  return (
    <main>
      <FoodCategories onCategorySelect={handleCategorySelect} />
      <FilterOptions onFilterChange={handleFilterChange} />
      {loading ? (
        <div className="loading">Loading restaurants...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <RestaurantGrid restaurants={filteredRestaurants} />
      )}
    </main>
  );
}

export default HomePage;