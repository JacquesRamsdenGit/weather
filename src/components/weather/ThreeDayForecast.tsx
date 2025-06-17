import { useWeather } from '../../context/WeatherContext.tsx';
import { useSettings } from '../../context/SettingsContext.tsx';
import { formatDate, formatDay, formatTemperature } from '../../utils/formatters.ts';
import WeatherIcon from '../common/WeatherIcon.tsx';

const ThreeDayForecast = () => {
  const { threeDayForecast, isLoading, selectedDate, selectDate } = useWeather();
  const { temperatureUnit } = useSettings();
  
  if (isLoading || !threeDayForecast.length) {
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
      }}>3-Day Forecast</h2>
        <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(3, minmax(0, 1fr))' : 'repeat(1, minmax(0, 1fr))',
        gap: '1rem'
      }}>        {threeDayForecast.map((day, index) => {
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
                padding: '1rem',
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
              fontSize: '1.125rem',
              fontWeight: 500,
              marginBottom: '0.5rem'
            }}>
              {formatDay(day.date)}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#9ca3af',
              marginBottom: '0.75rem'
            }}>
              {formatDate(day.date)}
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <WeatherIcon condition={day.condition} size={40} />
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center'
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
                <span style={{ fontWeight: 500 }}>{formatTemperature(day.highTemp, temperatureUnit)}</span>
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
                <span style={{ fontWeight: 500 }}>{formatTemperature(day.lowTemp, temperatureUnit)}</span>
              </div>
            </div>
            <div style={{
              marginTop: '0.75rem',
              fontSize: '0.875rem'
            }}>              <span style={{ color: '#3498db' }}>{day.precipProbability}%</span> chance of rain
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThreeDayForecast;
