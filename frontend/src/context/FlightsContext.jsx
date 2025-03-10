import { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Create the context
const FlightsContext = createContext();

// Create the provider
export const FlightsProvider = ({ children }) => {
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

    // Check if the results are in sessionStorage
    const searchKey = `${origin}-${destination}-${departureDate}-${returnDate}-${flightType}`;
    const storedFlights = sessionStorage.getItem(searchKey);

    if (storedFlights) {
      // If data exists in sessionStorage, use it
      setFlights(JSON.parse(storedFlights));
      setError('');
      setLoading(false);
      return;
    }

    // If no data in sessionStorage, make the API request
    setLoading(true);
    setError('');
    setFlights([]);

    const requestData = {
      origin,
      destination,
      departureDate: new Date(departureDate).toISOString().split('T')[0],
      flightType: flightType,
      class_type: 'ECO',
      sort_order: 'PRICE',
    };
    if (flightType === 'ROUND_TRIP') {
      console.log('ADDING RETURN dATE');
      requestParams.returnDate = new Date(returnDate)
        .toISOString()
        .split('T')[0];
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/flights`,
        requestData,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setFlights(new Array(response.data.data));

      // Store the results in sessionStorage
      sessionStorage.setItem(
        searchKey,
        JSON.stringify(new Array(response.data.data))
      );
    } catch (err) {
      console.log(err);
      setError('Failed to fetch flight deals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlightsContext.Provider value={{ flights, loading, error, searchDeals }}>
      {children}
    </FlightsContext.Provider>
  );
};

// Custom hook to use the context
export const useFlights = () => {
  return useContext(FlightsContext);
};
