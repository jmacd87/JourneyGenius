import React, { useState } from 'react';
import { convertMinutesToTime, formatDateToTime } from '../helpers';

const FlightResults = ({ flights }) => {
  const baseImageUrl =
    'https://s1.pclncdn.com/design-assets/fly/carrier-logos/';

  const filteredListings = flights?.listings?.filter(
    (listing) => listing.__typename === 'AirListingsRtlItinerary'
  );

  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;
  const totalResults = filteredListings?.length || 0;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentListings = filteredListings?.slice(
    indexOfFirstResult,
    indexOfLastResult
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const buildGoogleFlightsUrl = (slice) => {
    if (!slice?.segments?.length) return '#';

    const origin = slice.segments[0]?.departInfo?.airport?.code;
    const destination =
      slice.segments[slice.segments.length - 1]?.arrivalInfo?.airport?.code;
    const departDate =
      slice.segments[0]?.departInfo?.time?.dateTime?.split('T')[0];
    if (!origin || !destination || !departDate) return '#';

    const query = `Flights to ${destination} from ${origin} on ${departDate}`;
    return `https://www.google.com/travel/flights?q=${encodeURIComponent(
      query
    )}`;
  };

  return (
    <div className="relative mt-4 space-y-6 isolation-auto">
      <h3 className="text-2xl font-semibold text-gray-200 mb-4">
        Available Flights
      </h3>

      {currentListings?.length > 0 ? (
        currentListings.map((listing, index) => {
          const price =
            listing?.totalPriceWithDecimal?.price.toFixed(2) || '0.00';
          const airline = listing.airlines && listing.airlines[0];
          const airlineName = airline?.name || 'Unknown Airline';
          const airlineLogo = `${baseImageUrl}${airline?.image}?opto&auto=webp`;
          const slice = listing.slices[0];
          const bookingLink = buildGoogleFlightsUrl(slice);

          return (
            <div
              key={listing?.id || index}
              className="relative bg-gray-800/60 rounded-lg shadow-lg p-6 flex items-center flex-wrap z-10"
            >
              <img
                src={airlineLogo}
                alt={`${airlineName} logo`}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-16 md:h-16 mr-6 z-0"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/default-logo.png';
                }}
              />

              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-200">
                  {airlineName}
                </h4>
                <p className="text-white">
                  {slice
                    ? convertMinutesToTime(slice?.durationInMinutes)
                    : 'N/A'}
                </p>
                <p className="text-white">
                  {slice?.segments.length > 1
                    ? `${slice?.segments.length - 1} stop(s)`
                    : 'non-stop'}
                </p>
                <div className="text-gray-400 text-sm">
                  {slice?.segments?.map((segment, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start"
                    >
                      {/* First row: Airport codes */}
                      <div className="flex text-left">
                        <span>
                          {segment?.departInfo?.airport?.code || 'N/A'}
                        </span>
                        <span className="mx-2">-</span>
                        <span>
                          {segment?.arrivalInfo?.airport?.code || 'N/A'}
                        </span>
                      </div>
                      {/* Second row (on mobile) or inline (on desktop): Dates */}
                      <div className="sm:mt-0 sm:ml-4 text-left">
                        {formatDateToTime(segment?.departInfo?.time.dateTime)} -{' '}
                        {formatDateToTime(segment?.arrivalInfo?.time.dateTime)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-semibold text-gray-200">${price}</p>
                <a
                  className="z-10"
                  href={bookingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="mt-2 bg-blue-400 text-white py-2 px-4 rounded-md transition-colors duration-300 ease-in-out hover:bg-blue-600">
                    Book Now
                  </button>
                </a>
              </div>
            </div>
          );
        })
      ) : (
        <p className="text-gray-400 text-center">
          No flights available for your search criteria.
        </p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-400 hover:bg-blue-500'
            } text-white`}
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`px-3 py-1 rounded-md ${
                currentPage === i + 1
                  ? 'bg-blue-600'
                  : 'bg-blue-400 hover:bg-blue-500'
              } text-white`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-blue-400 hover:bg-blue-500'
            } text-white`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FlightResults;
