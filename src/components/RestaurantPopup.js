// src/components/RestaurantPopup.js

import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { FaMapMarkerAlt, FaPhoneAlt, FaGlobe } from 'react-icons/fa';
import '../styles/RestaurantPopup.css';

Modal.setAppElement('#root');

function RestaurantPopup({ isOpen, onRequestClose, restaurant }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // State variables for price estimates
  const [uberEatsPrice, setUberEatsPrice] = useState(null);
  const [doorDashPrice, setDoorDashPrice] = useState(null);

  useEffect(() => {
    if (!restaurant) return;

    const fetchDetails = () => {
      setLoading(true);
      setError(false);

      const service = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      const request = {
        placeId: restaurant.id,
        fields: [
          'name',
          'formatted_address',
          'formatted_phone_number',
          'opening_hours',
          'website',
          'rating',
          'reviews',
          'photos',
          'price_level',
        ],
      };

      service.getDetails(request, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setDetails(place);
          setLoading(false);

          // Perform the price calculations
          calculateAveragePrices(place);
        } else {
          console.error('Error fetching place details:', status);
          setError(true);
          setLoading(false);
        }
      });
    };

    fetchDetails();
  }, [restaurant]);

  /**
   * Calculates the average order prices for UberEats and DoorDash.
   * Formula:
   * - UberEats: BasePrice + (Distance * 0.4) + (Rating * 1)
   * - DoorDash: BasePrice + (Distance * 0.7) + (Rating * 0.8)
   */
  const calculateAveragePrices = (placeDetails) => {
    // Base prices based on price_level
    const basePriceMap = {
      1: 10, // $
      2: 20, // $$
      3: 40, // $$$
      4: 60, // $$$$
    };

    const basePrice =
      basePriceMap[placeDetails.price_level] || 10; // Default to $10

    const distance = restaurant.distance || 5; // Default to 5 km

    const rating = placeDetails.rating || 3; // Default rating

    // Calculate prices
    const uberEatsPriceCalc =
      basePrice + distance * 0.4 + rating * 1;

    const doorDashPriceCalc =
      basePrice + distance * 0.7 + rating * 0.8;

    setUberEatsPrice(uberEatsPriceCalc.toFixed(2));
    setDoorDashPrice(doorDashPriceCalc.toFixed(2));
  };

  if (!restaurant) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Restaurant Details"
      className="modal"
      overlayClassName="overlay"
    >
      <button
        onClick={onRequestClose}
        className="close-button"
        aria-label="Close modal"
      >
        &times;
      </button>
      {loading ? (
        <div className="modal-loading">Loading details...</div>
      ) : error ? (
        <div className="modal-error">Failed to load details.</div>
      ) : (
        <>
          {details.photos && details.photos.length > 0 && (
            <img
              src={details.photos[0].getUrl({ maxWidth: 600 })}
              alt={details.name}
              className="modal-image"
            />
          )}
          <div className="modal-content">
            {/* Restaurant Name in Yellow Rounded Rectangle */}
            <div className="restaurant-name-container">
              <h2>{details.name}</h2>
            </div>
            {/* Address */}
            <p>
              <FaMapMarkerAlt /> <strong>Address:</strong> {details.formatted_address}
            </p>
            {/* Phone */}
            {details.formatted_phone_number && (
              <p>
                <FaPhoneAlt /> <strong>Phone:</strong> {details.formatted_phone_number}
              </p>
            )}
            {/* Website */}
            {details.website && (
              <p>
                <FaGlobe />{' '}
                <strong></strong>{' '}
                <a
                  href={details.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Website
                </a>
              </p>
            )}
            {/* Average Order Prices */}
            {(uberEatsPrice || doorDashPrice) && (
              <div className="price-estimates-container">
                <strong>Average Order Prices:</strong>
                <ul>
                  {uberEatsPrice && (
                    <li>
                      <strong>
                        <a
                          href="https://www.ubereats.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="service-link"
                        >
                          UberEats
                        </a>
                      </strong>
                      : ${uberEatsPrice}
                    </li>
                  )}
                  {doorDashPrice && (
                    <li>
                      <strong>
                        <a
                          href="https://www.doordash.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="service-link"
                        >
                          DoorDash
                        </a>
                      </strong>
                      : ${doorDashPrice}
                    </li>
                  )}
                </ul>
              </div>
            )}
            {/* Opening Hours in Light Grey Rounded Rectangle */}
            {details.opening_hours && details.opening_hours.weekday_text && (
              <div className="opening-hours-container">
                <strong>Opening Hours:</strong>
                <ul>
                  {details.opening_hours.weekday_text.map((day, index) => (
                    <li key={index}>{day}</li>
                  ))}
                </ul>
              </div>
            )}
            {/* Rating */}
            {details.rating && (
              <p>
                <strong>Rating:</strong> {details.rating} / 5
              </p>
            )}
            {/* Reviews */}
            {details.reviews && details.reviews.length > 0 && (
              <div className="reviews-container">
                <strong>Reviews:</strong>
                <ul>
                  {details.reviews.slice(0, 3).map((review) => (
                    <li key={review.time}>
                      <p>
                        <strong>{review.author_name}:</strong> {review.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}

export default RestaurantPopup;