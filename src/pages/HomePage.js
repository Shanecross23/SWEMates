// src/pages/HomePage.js

// Import React and essential hooks
import React, { useEffect, useState } from 'react';
// Import components used in this page
import FoodCategories from '../components/FoodCategories';
import FilterOptions from '../components/FilterOptions';
import RestaurantGrid from '../components/RestaurantGrid';
import RestaurantPopup from '../components/RestaurantPopup'; // Component for restaurant detail modal
import Footer from '../components/Footer';
// Import CSS styles for this page
import '../styles/HomePage.css';
// Import Google Maps library hook for script loading
import { useLoadScript } from '@react-google-maps/api';

// Define libraries required for Google Maps API
const libraries = ['places'];

function HomePage() {
  // State variables to manage restaurant data, filters, and loading/error states
  const [restaurants, setRestaurants] = useState([]); // All fetched restaurants
  const [filteredRestaurants, setFilteredRestaurants] = useState([]); // Restaurants after applying filters
  const [activeFilter, setActiveFilter] = useState(''); // Current active filter (Rating, Distance, etc.)
  const [activeCategoryKeyword, setActiveCategoryKeyword] = useState(null); // Selected food category keyword
  const [loading, setLoading] = useState(true); // Loading state indicator
  const [error, setError] = useState(null); // Error message state

  // State variables for modal behavior
  const [selectedRestaurant, setSelectedRestaurant] = useState(null); // Currently selected restaurant for modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open/close state

  // Load Google Maps script with API key and required libraries
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, // API key must be set in environment variables
    libraries: libraries,
  });

  /**
   * Fetch restaurant data when Google Maps script is loaded or category changes.
   */
  useEffect(() => {
    if (!isLoaded) return; // Wait until the script is loaded

    const fetchRestaurants = () => {
      setLoading(true);
      setError(null); // Clear previous errors

      try {
        const address = localStorage.getItem('userAddress'); // Retrieve user address from local storage
        if (!address) {
          throw new Error('No address found. Please enter your address.');
        }

        const geocoder = new window.google.maps.Geocoder();

        // Convert user address to geographic coordinates
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;

            // Create a dummy map object required by the PlacesService
            const map = new window.google.maps.Map(document.createElement('div'));
            const service = new window.google.maps.places.PlacesService(map);

            // Define a search request for nearby restaurants
            const request = {
              location: location,
              radius: 5000, // Search within 5 km radius
              type: ['restaurant'], // Limit results to restaurants
              keyword: activeCategoryKeyword, // Filter by category keyword if selected
            };

            // Fetch restaurant data using Places API
            service.nearbySearch(request, (results, status) => {
              if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                // Map API response to restaurant objects
                const fetchedRestaurants = results.map((place) => ({
                  id: place.place_id,
                  name: place.name,
                  image: place.photos
                    ? place.photos[0].getUrl({ maxWidth: 400 })
                    : '/images/default-restaurant.jpg', // Default image if no photos are available
                  cuisine:
                    place.types && place.types.length > 0
                      ? place.types[0].replace('_', ' ').toUpperCase()
                      : 'Unknown', // Extract and format cuisine type
                  rating: place.rating || 'N/A', // Restaurant rating
                  distance: null, // Distance will be calculated later
                  distanceText: '',
                  durationText: '',
                  priceLevel: place.price_level || 0, // Price level
                  geometry: place.geometry,
                  location: place.geometry.location, // Lat/Lng location
                }));

                // Use Distance Matrix API to calculate distances
                const origins = [location];
                const destinations = fetchedRestaurants.map(
                  (restaurant) => restaurant.location
                );

                const distanceMatrixService =
                  new window.google.maps.DistanceMatrixService();

                // Fetch distances for all restaurants
                distanceMatrixService.getDistanceMatrix(
                  {
                    origins: origins,
                    destinations: destinations,
                    travelMode: window.google.maps.TravelMode.DRIVING, // Travel mode
                    unitSystem: window.google.maps.UnitSystem.METRIC, // Metric units
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

                      // Update state with fetched and processed data
                      setRestaurants(restaurantsWithDistances);
                      setFilteredRestaurants(restaurantsWithDistances);
                      setLoading(false); // Data successfully loaded
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
        console.error(err); // Log error to console
        setError(err.message); // Update error state
        setLoading(false); // Stop loading indicator
      }
    };

    fetchRestaurants();
  }, [isLoaded, activeCategoryKeyword]); // Dependencies to re-fetch data

  // Handlers for UI interactions (filter, category, and modal)
  const handleFilterChange = (filter) => {
    setActiveFilter(filter); // Update active filter state
    applyFilters(filter); // Apply the selected filter
  };

  const handleCategorySelect = (keyword) => {
    setActiveCategoryKeyword(keyword); // Update category keyword
    setActiveFilter(''); // Reset filter when category changes
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurant(restaurant); // Set selected restaurant for modal
    setIsModalOpen(true); // Open modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close modal
    setSelectedRestaurant(null); // Clear selected restaurant
  };

  /**
   * Apply sorting filters to restaurant data based on user selection
   */
  const applyFilters = (filter) => {
    let updatedRestaurants = [...restaurants]; // Clone restaurant array

    if (filter) {
      switch (filter) {
        case 'Rating':
          updatedRestaurants.sort((a, b) => b.rating - a.rating); // Sort by rating (descending)
          break;
        case 'Distance':
          updatedRestaurants.sort((a, b) => {
            if (a.distance === null) return 1; // Place null values at the end
            if (b.distance === null) return -1;
            return a.distance - b.distance; // Sort by distance (ascending)
          });
          break;
        case 'Price':
          updatedRestaurants.sort((a, b) => a.priceLevel - b.priceLevel); // Sort by price level (ascending)
          break;
        default:
          break;
      }
    }

    setFilteredRestaurants(updatedRestaurants); // Update state with sorted data
  };

  // Render error message if Google Maps script fails to load
  if (loadError) {
    return <div className="error">Error loading maps. Please try again later.</div>;
  }

  return (
    <>
      <main className="home-page">
        {/* Render category selection component */}
        <FoodCategories onCategorySelect={handleCategorySelect} />

        {/* Render sorting filter options */}
        <FilterOptions onFilterChange={handleFilterChange} />

        {/* Conditional rendering for loading and error states */}
        {loading ? (
          <div className="loading">Loading restaurants...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <RestaurantGrid
            restaurants={filteredRestaurants}
            onRestaurantClick={handleRestaurantClick} // Pass handler for restaurant clicks
          />
        )}
      </main>

      {/* Render footer */}
      <Footer />

      {/* Render modal for selected restaurant details */}
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

export default HomePage; // Export component