// src/pages/HomePage.js

import React, { useEffect, useState } from 'react';
import FoodCategories from '../components/FoodCategories';
import FilterOptions from '../components/FilterOptions';
import RestaurantGrid from '../components/RestaurantGrid';
import RestaurantPopup from '../components/RestaurantPopup'; // Import the new component
import Footer from '../components/Footer';
import '../styles/HomePage.css';
import { useLoadScript } from '@react-google-maps/api';

const libraries = ['places'];

function HomePage() {
  // Existing state variables
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [activeFilter, setActiveFilter] = useState('');
  const [activeCategoryKeyword, setActiveCategoryKeyword] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state variables for modal
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // Ensure this environment variable is set
    libraries: libraries,
  });

  /**
   * Effect to fetch restaurants when the script is loaded or the category changes
   */
  useEffect(() => {
    if (!isLoaded) return;

    const fetchRestaurants = () => {
      setLoading(true);
      setError(null);

      try {
        const address = localStorage.getItem('userAddress'); // Ensure the address is stored correctly
        if (!address) {
          throw new Error('No address found. Please enter your address.');
        }

        const geocoder = new window.google.maps.Geocoder();

        // Geocode the address to get latitude and longitude
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;

            // Initialize the map (required for PlacesService)
            const map = new window.google.maps.Map(document.createElement('div'));
            const service = new window.google.maps.places.PlacesService(map);

            // Prepare the Places API request
            const request = {
              location: location,
              radius: 5000, // 5 km radius
              type: ['restaurant'],
              keyword: activeCategoryKeyword, // Include keyword if a category is selected
            };

            // Perform nearby search
            service.nearbySearch(request, (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                // Process the fetched places
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
                  distance: null, // Will calculate later
                  distanceText: '',
                  durationText: '',
                  priceLevel: place.price_level || 0,
                  geometry: place.geometry,
                  location: place.geometry.location,
                }));

                // Calculate distances using Distance Matrix Service
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
  }, [isLoaded, activeCategoryKeyword]); // Dependency on activeCategoryKeyword

  /**
   * Handles changes in the filter options (Rating, Distance, Price)
   * @param {string|null} filter - The selected filter option
   */
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    applyFilters(filter);
  };

  /**
   * Handles category selection from FoodCategories component
   * @param {string|null} keyword - The keyword associated with the selected category
   */
  const handleCategorySelect = (keyword) => {
    setActiveCategoryKeyword(keyword);
    // Reset active filter when a new category is selected
    setActiveFilter('');
  };

  /**
   * Handles restaurant card click to open modal with details
   * @param {Object} restaurant - The selected restaurant object
   */
  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);
  };

  /**
   * Closes the restaurant detail modal
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRestaurant(null);
  };

  /**
   * Applies sorting filters to the list of restaurants
   * @param {string|null} filter - The selected filter option
   */
  const applyFilters = (filter) => {
    let updatedRestaurants = [...restaurants];

    // Since category filtering is handled via API, only apply sorting

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

  // Handle errors in loading the Google Maps script
  if (loadError) {
    return <div className="error">Error loading maps. Please try again later.</div>;
  }

  return (
    <>
      <main className="home-page">
        {/* Render FoodCategories component and pass the handler */}
        <FoodCategories onCategorySelect={handleCategorySelect} />

        {/* Render FilterOptions component and pass the handler */}
        <FilterOptions onFilterChange={handleFilterChange} />

        {/* Conditional Rendering based on loading and error states */}
        {loading ? (
          <div className="loading">Loading restaurants...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <RestaurantGrid
            restaurants={filteredRestaurants}
            onRestaurantClick={handleRestaurantClick}
          />
        )}
      </main>

      {/* Render Footer */}
      <Footer />

      {/* Render RestaurantPopup modal */}
      {selectedRestaurant && (
        <RestaurantPopup
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          restaurant={selectedRestaurant}
        />
      )}
    </>
  );
}

export default HomePage;