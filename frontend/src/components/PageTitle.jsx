import React from 'react';
import reactLogo from '../assets/react.svg';

export default function PageTitle() {
  return (
    <div className="text-center my-8">
      <img
        src={reactLogo}
        className="w-22 h-22 mx-auto mb-4"
        alt="React logo"
      />
      <h1 className="text-5xl font-bold">
        <span
          className="text-white"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Journey
        </span>{' '}
        <span
          className="font-bold text-rose-400"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          Genius
        </span>
      </h1>
    </div>
  );
}
