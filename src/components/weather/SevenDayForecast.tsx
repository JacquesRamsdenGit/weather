import { useWeather } from '../../context/WeatherContext.tsx';
import { useSettings } from '../../context/SettingsContext.tsx';
import { formatDate, formatDay, formatTemperature } from '../../utils/formatters.ts';
import WeatherIcon from '../common/WeatherIcon.tsx';

const SevenDayForecast= () => {
  const { sevenDayForecast, isLoading, selectedDate, selectDate } = useWeather();
  const { temperatureUnit } = useSettings();
  
  if (isLoading || !sevenDayForecast.length) {
    return (
      <div style={{
        backgroundColor: 'rgba(30, 30, 30, 0.7)',
        backdropFilter: 'blur(10px)',
        padding: '1rem',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}>
        <div style={{
          height: '5rem',
          backgroundColor: 'rgba(75, 85, 99, 0.5)',
          borderRadius: '0.5rem'
        }}></div>
      </div>
    );
  }
  
  // Determine grid columns based on screen width
  const getGridCols = () => {
    const width = window.innerWidth;
    if (width >= 1024) return 'repeat(4, minmax(0, 1fr))';
    if (width >= 640) return 'repeat(2, minmax(0, 1fr))';
    return 'repeat(1, minmax(0, 1fr))';
  };
  
  return (
    <div style={{
      backgroundColor: 'rgba(30, 30, 30, 0.7)',
      backdropFilter: 'blur(10px)',
      padding: '1rem',
      borderRadius: '0.5rem'
    }}>
      <h2 style={{
        fontSize: '1.125rem',
        marginBottom: '1rem',
        fontWeight: 500,
        color: '#f5f5f7'
      }}>7-Day Forecast</h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: getGridCols(),
        gap: '1rem'
      }}>        {sevenDayForecast.map((day, index) => {
          const isSelected = selectedDate && 
            day.date.toDateString() === selectedDate.toDateString();
          
          return (
            <div 
              key={index} 
              onClick={() => selectDate(day.date)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.75rem',
                backgroundColor: isSelected 
                  ? 'rgba(59, 130, 246, 0.3)' 
                  : 'rgba(31, 41, 55, 0.3)',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease-in-out',
                border: isSelected 
                  ? '2px solid #3b82f6' 
                  : '2px solid transparent',
                transform: 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 0.5)';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.backgroundColor = 'rgba(31, 41, 55, 0.3)';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
            <div style={{
              fontSize: '1rem',
              fontWeight: 500,
              marginBottom: '0.25rem'
            }}>
              {formatDay(day.date)}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: '#9ca3af',
              marginBottom: '0.5rem'
            }}>
              {formatDate(day.date)}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <WeatherIcon condition={day.condition} size={32} />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginRight: '1rem'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af'
                }}>High</span>
                <span style={{
                  fontWeight: 500,
                  fontSize: '0.875rem'
                }}>{formatTemperature(day.highTemp, temperatureUnit)}</span>
              </div>
              <div style={{
                width: '1px',
                height: '2rem',
                backgroundColor: '#4b5563'
              }}></div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginLeft: '1rem'
              }}>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af'
                }}>Low</span>
                <span style={{
                  fontWeight: 500,
                  fontSize: '0.875rem'
                }}>{formatTemperature(day.lowTemp, temperatureUnit)}</span>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.75rem'
            }}>
              <span style={{
                color: '#3498db',
                marginRight: '0.25rem'              }}>{day.precipProbability}%</span> precip
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default SevenDayForecast;
