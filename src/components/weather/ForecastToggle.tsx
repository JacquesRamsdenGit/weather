import React from 'react';
import { ForecastType } from '../../types/weather.ts';

interface ForecastToggleProps {
  forecastType: ForecastType;
  onToggle: (type: ForecastType) => void;
}

const ForecastToggle: React.FC<ForecastToggleProps> = ({ forecastType, onToggle }) => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '2rem'
    }}>
      <div style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        padding: '0.375rem',
        backgroundColor: 'rgba(31, 41, 55, 0.5)',
        backdropFilter: 'blur(4px)',
        borderRadius: '0.75rem',
        border: '1px solid rgba(75, 85, 99, 0.2)',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        width: '100%'
      }}>
        <button
          style={{
            flex: '1 1 0%',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            transition: 'all 0.2s',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: forecastType === 'hourly' ? 'white' : '#d1d5db',
            backgroundColor: forecastType === 'hourly' 
              ? 'linear-gradient(to bottom right, #3498db, #2980b9)'
              : 'transparent',
            boxShadow: forecastType === 'hourly' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
            border: 'none',
            cursor: 'pointer',
            background: forecastType === 'hourly' 
              ? 'linear-gradient(to bottom right, #3498db, #2980b9)' 
              : 'transparent'
          }}
          onClick={() => onToggle('hourly')}
        >
          Hourly
        </button>
        <button
          style={{
            flex: '1 1 0%',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            transition: 'all 0.2s',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: forecastType === 'three-day' ? 'white' : '#d1d5db',
            backgroundColor: forecastType === 'three-day' 
              ? 'linear-gradient(to bottom right, #3498db, #2980b9)'
              : 'transparent',
            boxShadow: forecastType === 'three-day' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
            border: 'none',
            cursor: 'pointer',
            background: forecastType === 'three-day' 
              ? 'linear-gradient(to bottom right, #3498db, #2980b9)' 
              : 'transparent'
          }}
          onClick={() => onToggle('three-day')}
        >
          3 Days
        </button>
        <button
          style={{
            flex: '1 1 0%',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            transition: 'all 0.2s',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: forecastType === 'seven-day' ? 'white' : '#d1d5db',
            backgroundColor: forecastType === 'seven-day' 
              ? 'linear-gradient(to bottom right, #3498db, #2980b9)'
              : 'transparent',
            boxShadow: forecastType === 'seven-day' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' : 'none',
            border: 'none',
            cursor: 'pointer',
            background: forecastType === 'seven-day' 
              ? 'linear-gradient(to bottom right, #3498db, #2980b9)' 
              : 'transparent'
          }}
          onClick={() => onToggle('seven-day')}
        >
          7 Days
        </button>
      </div>
    </div>
  );
};

export default ForecastToggle;
