const express = require('express');
const axios = require('axios');
require('dotenv').config();

const router = express.Router();

router.post('/', async (req, res) => {
  console.log('🔍 Received request at /api/flights');
  console.log('📥 Raw Request Body:', req.body);

  if (!req.body || Object.keys(req.body).length === 0) {
    console.error('❌ No request body received!');
    return res.status(400).json({ error: 'Request body is missing or empty' });
  }

  // Extract parameters from the request body
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    itineraryType = 'ROUND_TRIP',
    classType = 'ECO', // Changed from ECONOMY to ECO per the updated query
    sortOrder = 'PRICE',
  } = req.body;

  // Validate required parameters
  if (!origin || !destination || !departureDate) {
    console.error('❌ Missing required parameters');
    return res.status(400).json({
      error:
        'Fields "origin", "destination", and "departureDate" are required.',
    });
  }

  // Priceline expects specific parameter names
  const requestParams = {
    location_departure: origin,
    location_arrival: destination,
    date_departure: departureDate,
    class_type: classType,
    sort_order: sortOrder,
    itinerary_type: itineraryType,
    date_departure_return: returnDate,
  };

  try {
    console.log(
      '🌍 Making request to Priceline API with parameters:',
      requestParams
    );

    const response = await axios.get(
      'https://priceline-com-provider.p.rapidapi.com/v1/flights/search',
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'priceline-com-provider.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
        params: requestParams, // Ensure we send correct params
      }
    );

    console.log('✅ Priceline API Response:', response.data);
    res.json(response.data);
  } catch (error) {
    console.log(error);
    console.error(
      '❌ Error fetching flights:',
      error.response?.data || error.message
    );
    res.status(500).json({
      error: 'Failed to fetch flight deals. Check API key and parameters.',
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
