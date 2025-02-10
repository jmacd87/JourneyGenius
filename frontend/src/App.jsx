import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { FlightsProvider } from './context/FlightsContext';
import { Analytics } from '@vercel/analytics/react';

const App = () => {
  return (
    <FlightsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
      <Analytics />
    </FlightsProvider>
  );
};

export default App;
