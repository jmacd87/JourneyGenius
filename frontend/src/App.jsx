import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import { FlightsProvider } from './context/FlightsContext';

const App = () => {
  return (
    <FlightsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </FlightsProvider>
  );
};

export default App;
