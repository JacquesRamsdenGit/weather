import { useWeather } from '../../context/WeatherContext.tsx';
import { useSettings } from '../../context/SettingsContext.tsx';
import WeatherIcon from '../common/WeatherIcon.tsx';
import { formatTemperature } from '../../utils/formatters.ts';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const CurrentWeather = () => {
  const { currentWeather, isLoading, refreshWeather, selectedDate, threeDayForecast, sevenDayForecast } = useWeather();
  const { temperatureUnit } = useSettings();
  
  // If a date is selected, find the corresponding day data
  const displayData = selectedDate ? (() => {
    const selectedDateStr = selectedDate.toDateString();
    const dayData = [...threeDayForecast, ...sevenDayForecast].find(day => 
      day.date.toDateString() === selectedDateStr
    );
      if (dayData) {
      // Use the complete day data which now includes all the fields we need
      return {
        temperature: dayData.highTemp, // Use high temp as main temperature
        feelsLike: dayData.highTemp, // Approximate feels like
        condition: dayData.condition,
        humidity: dayData.humidity,
        windSpeed: dayData.windSpeed,
        windDirection: dayData.windDirection,
        pressure: dayData.pressure,
        visibility: dayData.visibility,
        uvIndex: dayData.uvIndex,
        precipitation: dayData.precipProbability,
        lastUpdated: dayData.date,
        sunrise: dayData.sunrise,
        sunset: dayData.sunset,
        high: dayData.highTemp,
        low: dayData.lowTemp,
        moonData: dayData.moonData,
        marineData: dayData.marineData
      };
    }
    return null;
  })() : currentWeather;
  
  if (isLoading || !displayData) {
    return (
      <div style={{
        backgroundColor: 'rgba(30, 30, 30, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(107, 114, 128, 0.2)',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }}>
        <div style={{
          height: '8rem',
          backgroundColor: 'rgba(75, 85, 99, 0.5)',
          borderRadius: '0.5rem'
        }}></div>
      </div>
    );
  }
  const formattedTemp = formatTemperature(displayData.temperature, temperatureUnit);
  const formattedFeelsLike = formatTemperature(displayData.feelsLike, temperatureUnit);
  const formattedHigh = formatTemperature(displayData.high, temperatureUnit);
  const formattedLow = formatTemperature(displayData.low, temperatureUnit);
  
  // Format time
  const lastUpdated = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(displayData.lastUpdated);  return (
    <div style={{
      backgroundColor: 'rgba(30, 30, 30, 0.7)',
      backdropFilter: 'blur(10px)',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      border: '1px solid rgba(107, 114, 128, 0.2)',
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 500,
          color: '#f5f5f7',
          marginBottom: '0.25rem'
        }}>Current Weather</h2>
        <div style={{
          fontSize: '0.75rem',
          color: '#9ca3af',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span>Updated {lastUpdated}</span>
          <button 
            onClick={refreshWeather}
            style={{
              marginLeft: '0.5rem',
              borderRadius: '9999px',
              padding: '0.25rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Refresh weather data"
          >
            <ArrowPathIcon style={{ height: '0.875rem', width: '0.875rem', color: '#9ca3af' }} />
          </button>
        </div>
      </div>
      
      {/* Decorative blurred background effect */}
      <div style={{
        position: 'absolute',
        top: '-6rem',
        right: '-6rem',
        width: '16rem',
        height: '16rem',
        borderRadius: '9999px',
        backgroundColor: 'rgba(52, 152, 219, 0.1)',
        filter: 'blur(40px)',
        opacity: 0.7,
        pointerEvents: 'none',
        zIndex: 0
      }}></div>
      
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          marginRight: '1.5rem',
          marginBottom: '1rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{ marginRight: '1rem' }}>
              <WeatherIcon condition={displayData.condition} size={48} />
            </div>
            <div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                fontFamily: 'Outfit, sans-serif',
                background: 'linear-gradient(to right, #f5f5f7, #d1d1d6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {formattedTemp}
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: '#9ca3af'
              }}>
                Feels like {formattedFeelsLike}
              </div>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginRight: '1rem'
            }}>
              <span style={{ 
                color: '#3498db', 
                fontSize: '0.875rem', 
                marginRight: '0.25rem' 
              }}>▲</span>
              <span>{formattedHigh}</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ 
                color: '#e74c3c', 
                fontSize: '0.875rem', 
                marginRight: '0.25rem' 
              }}>▼</span>
              <span>{formattedLow}</span>
            </div>
          </div>
        </div>
        
        <div style={{
          fontSize: '0.875rem',
          flex: '1 1 0%',
          minWidth: '12rem'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
            gap: '0.75rem'
          }}>
            <div>
              <div style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>Humidity</div>
              <div style={{ fontWeight: 500 }}>{displayData.humidity}%</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>Wind</div>
              <div style={{ fontWeight: 500 }}>{displayData.windSpeed} km/h</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>Pressure</div>
              <div style={{ fontWeight: 500 }}>{displayData.pressure} hPa</div>
            </div>
            <div>
              <div style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>UV Index</div>
              <div style={{ fontWeight: 500 }}>{displayData.uvIndex}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;