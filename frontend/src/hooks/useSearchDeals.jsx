import { useState } from 'react';
import axios from 'axios';

const useSearchDeals = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [flights, setFlights] = useState([]);

  const searchDeals = async ({
    origin,
    destination,
    departureDate,
    returnDate,
    flightType,
  }) => {
    if (!origin || !destination || !departureDate) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    setFlights([]);

    const requestData = {
      origin,
      destination,
      departureDate: new Date(departureDate).toISOString().split('T')[0],
      returnDate: new Date(returnDate).toISOString().split('T')[0],
      itinerary_type: flightType,
      class_type: 'ECO',
      sort_order: 'PRICE',
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/api/flights',
        requestData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      console.log('setting flights in hook', response.data.data);
      setFlights(response.data.data);
    } catch (err) {
      setError('Failed to fetch flight deals.');
    } finally {
      setLoading(false);
    }
  };
  console.log('Hook flights', flights);
  return { flights, loading, error, searchDeals };
};

export default useSearchDeals;
