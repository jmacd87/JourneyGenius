import React from 'react';
import SearchForm from '../components/SearchForm';
import ChatBot from '../components/ChatBot';
import FlightResults from '../components/FlightResults'; // Import FlightResults
import PageTitle from '../components/PageTitle';
import reactLogo from '../assets/react.svg';
import { useFlights } from '../context/FlightsContext';

const Home = () => {
  const { flights, loading, error, searchDeals } = useFlights();

  return (
    <div className="relative min-h-screen flex flex-col items-center pt-[5vh] bg-gradient-to-r from-gray-900 to-gray-800 p-4">
      {/* React Logo Background */}
      <img
        src={reactLogo}
        alt="React Logo"
        className="absolute left-1/2 top-1/2 h-screen object-cover transform -translate-x-1/2 -translate-y-1/2 opacity-10"
      />
      <div>
        <PageTitle className="z-100" />
        <div className="w-full min-h-[400px] h-[450px] max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-800/70 backdrop-blur-lg shadow-xl rounded-2xl p-6 relative z-10 opacity-85">
          {/* Search Form */}
          <div className="flex justify-center h-full">
            <SearchForm searchDeals={searchDeals} loading={loading} />
          </div>

          {/* ChatBot */}
          <div className="flex justify-center h-full overflow-hidden">
            <ChatBot />
          </div>
        </div>

        {/* Flight Results */}
        {!loading && flights.length > 0 && (
          <div className="w-full max-w-5xl mt-6">
            <FlightResults flights={flights[0]} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
