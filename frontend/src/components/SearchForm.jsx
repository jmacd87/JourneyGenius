import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Calendar, Plane } from 'lucide-react';
import { getDefaultDate, getFormattedDate } from '../helpers';
import { useFlights } from '../context/FlightsContext';
import { ClipLoader } from 'react-spinners';
import airports from '../data/airports.json';

// Custom hook to detect clicks outside of a given element
function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or its descendants
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}

const SearchForm = () => {
  const [destination, setDestination] = useState('LAX');
  const [origin, setOrigin] = useState('NYC');
  const [departureDate, setDepartureDate] = useState(
    getFormattedDate(new Date())
  );
  const [flightType, setFlightType] = useState('ROUND_TRIP');
  const [returnDate, setReturnDate] = useState(
    getFormattedDate(getDefaultDate())
  );
  const [filteredOriginAirports, setFilteredOriginAirports] = useState([]);
  const [filteredDestinationAirports, setFilteredDestinationAirports] =
    useState([]);
  const [isOriginDropdownOpen, setIsOriginDropdownOpen] = useState(false);
  const [isDestinationDropdownOpen, setIsDestinationDropdownOpen] =
    useState(false);

  const originDropdownRef = useRef(null);
  const destinationDropdownRef = useRef(null);

  const { loading, error, searchDeals } = useFlights();

  // Use the custom hook for each dropdown
  useOnClickOutside(originDropdownRef, () => {
    setIsOriginDropdownOpen(false);
    setFilteredOriginAirports([]);
  });
  useOnClickOutside(destinationDropdownRef, () => {
    setIsDestinationDropdownOpen(false);
    setFilteredDestinationAirports([]);
  });

  const handleSearch = () => {
    searchDeals({ origin, destination, departureDate, returnDate, flightType });
  };

  // This function updates the input and filters the airports.
  // It assigns a score based on the matching priority:
  // Code match (score 3) > city match (score 2) > name match (score 1)
  const handleAirportChange = (
    input,
    setType,
    setFilteredAirports,
    setIsDropdownOpen
  ) => {
    setType(input.toUpperCase());
    if (input.length > 0) {
      const matches = airports
        .map((airport) => {
          let score = 0;
          if (airport.code?.toLowerCase().startsWith(input.toLowerCase()))
            score += 3;
          if (airport.city?.toLowerCase().includes(input.toLowerCase()))
            score += 2;
          if (airport.name?.toLowerCase().includes(input.toLowerCase()))
            score += 1;
          return { airport, score };
        })
        .filter((item) => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((item) => item.airport);

      setFilteredAirports(matches);
      setIsDropdownOpen(true);
    } else {
      setFilteredAirports([]);
      setIsDropdownOpen(false);
    }
  };

  const selectAirport = (
    airport,
    setType,
    setFilteredAirports,
    setIsDropdownOpen
  ) => {
    setType(airport.code);
    setFilteredAirports([]);
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full max-w-lg">
      <h2 className="text-2xl font-semibold text-gray-200 text-center mb-4">
        Find Your Next Flight
      </h2>
      <div className="space-y-3">
        {/* Flight Type Dropdown */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            Type:
          </span>
          <select
            className="w-full pl-24 p-3 rounded-lg bg-gray-700 text-gray-200"
            value={flightType}
            onChange={(e) => setFlightType(e.target.value)}
          >
            <option value="ONE_WAY">One Way</option>
            <option value="ROUND_TRIP">Round Trip</option>
          </select>
        </div>

        {/* Origin Input */}
        <div className="relative">
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            From:
          </span>
          <input
            type="text"
            className="w-full pl-24 p-3 rounded-lg bg-gray-700 text-gray-200"
            value={origin}
            onChange={(e) =>
              handleAirportChange(
                e.target.value,
                setOrigin,
                setFilteredOriginAirports,
                setIsOriginDropdownOpen
              )
            }
          />
          {isOriginDropdownOpen && filteredOriginAirports.length > 0 && (
            <ul
              ref={originDropdownRef}
              className="absolute w-full bg-gray-800 text-white rounded-lg mt-1 shadow-lg z-20"
            >
              {filteredOriginAirports.map((airport) => (
                <li
                  key={airport.code}
                  className="p-2 hover:bg-gray-600 cursor-pointer"
                  onClick={() =>
                    selectAirport(
                      airport,
                      setOrigin,
                      setFilteredOriginAirports,
                      setIsOriginDropdownOpen
                    )
                  }
                >
                  {airport.code} - {airport.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Destination Input */}
        <div className="relative">
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            To:
          </span>
          <input
            type="text"
            className="w-full pl-24 p-3 rounded-lg bg-gray-700 text-gray-200"
            placeholder="Enter airport code or name"
            value={destination}
            onChange={(e) =>
              handleAirportChange(
                e.target.value,
                setDestination,
                setFilteredDestinationAirports,
                setIsDestinationDropdownOpen
              )
            }
          />
          {isDestinationDropdownOpen &&
            filteredDestinationAirports.length > 0 && (
              <ul
                ref={destinationDropdownRef}
                className="absolute w-full bg-gray-800 text-white rounded-lg mt-1 shadow-lg z-20"
              >
                {filteredDestinationAirports.map((airport) => (
                  <li
                    key={airport.code}
                    className="p-2 hover:bg-gray-600 cursor-pointer"
                    onClick={() =>
                      selectAirport(
                        airport,
                        setDestination,
                        setFilteredDestinationAirports,
                        setIsDestinationDropdownOpen
                      )
                    }
                  >
                    {airport.code} - {airport.name}
                  </li>
                ))}
              </ul>
            )}
        </div>

        {/* Departure Date */}
        <div className="relative">
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            Depart:
          </span>
          <input
            type="date"
            className="w-full pl-24 p-3 rounded-lg bg-gray-700 text-gray-200 cursor-pointer appearance-none"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />
        </div>

        {/* Return Date (Only for Round Trip) */}
        {flightType === 'ROUND_TRIP' && (
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              Return:
            </span>
            <input
              type="date"
              className="w-full pl-24 p-3 rounded-lg bg-gray-700 text-gray-200 cursor-pointer appearance-none"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
            />
          </div>
        )}

        {/* Search Button */}
        <button
          className="group w-full bg-blue-400 text-white p-3 rounded-lg flex items-center justify-center h-12 transition-colors duration-300 ease-in-out hover:bg-blue-600"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? (
            <ClipLoader size={25} color={'#f1f1f1'} />
          ) : (
            <span className="h-6 flex items-center font-bold">
              SEARCH
              <Plane className="ml-2 transform transition-transform duration-300 group-hover:rotate-45" />
            </span>
          )}
        </button>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default SearchForm;
