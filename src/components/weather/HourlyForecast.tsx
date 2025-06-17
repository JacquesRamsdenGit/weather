import { useWeather } from '../../context/WeatherContext.tsx';
import { useSettings } from '../../context/SettingsContext.tsx';
import { formatTemperature, formatTime } from '../../utils/formatters.ts';
import WeatherIcon from '../common/WeatherIcon.tsx';

const HourlyForecast = () => {
  const { hourlyForecast, isLoading, selectedDate } = useWeather();
  const { temperatureUnit } = useSettings();
  const currentHour = new Date().getHours();
  
  // Create a rolling 24-hour window starting from the current hour or selected date
  const getOrderedHourlyForecast = () => {
    if (!hourlyForecast.length) return [];
    
    // If a date is selected, filter to show only that day's hourly data
    if (selectedDate) {
      const selectedDateStr = selectedDate.toDateString();
      const dayHours = hourlyForecast.filter(hour => 
        hour.time.toDateString() === selectedDateStr
      );
      return dayHours.slice(0, 24); // Show up to 24 hours for the selected day
    }
    
    // Find the index of the current hour in the forecast data
    const currentHourIndex = hourlyForecast.findIndex(hour => 
      hour.time.getHours() === currentHour
    );
    
    // If current hour is found, start from there; otherwise start from beginning
    if (currentHourIndex !== -1) {
      // Take 24 hours starting from current hour
      return [
        ...hourlyForecast.slice(currentHourIndex, currentHourIndex + 24),
        // If we need more hours to reach 24, wrap around to the beginning
        ...hourlyForecast.slice(0, Math.max(0, 24 - (hourlyForecast.length - currentHourIndex)))
      ].slice(0, 24);
    }
    
    // Fallback to first 24 hours if current hour not found
    return hourlyForecast.slice(0, 24);
  };
  
  const orderedForecast = getOrderedHourlyForecast();
  
  if (isLoading || !hourlyForecast.length) {
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
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '0.5rem'
    }}>
      <h2 style={{
        fontSize: '1.125rem',
        marginBottom: '1rem',
        fontWeight: 500,
        color: '#f5f5f7'
      }}>Hourly Forecast</h2>
      
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        right: '-4rem',
        top: '4rem',
        width: '8rem',
        height: '8rem',
        borderRadius: '9999px',
        backgroundColor: 'rgba(52, 152, 219, 0.05)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }}></div>
        <div style={{
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        paddingTop: '0.5rem' // Add top padding to prevent clipping
      }}>
        <div style={{
          display: 'inline-flex',
          minWidth: '100%'
        }}>          {orderedForecast.map((hour, index) => {
            const now = new Date();
            const isCurrentHour = !selectedDate && 
              hour.time.getHours() === now.getHours() && 
              hour.time.toDateString() === now.toDateString();
            
            return (<div 
              key={index} 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.5rem 0.75rem',
                paddingLeft: index === 0 ? '0' : '0.75rem',
                paddingRight: index === 23 ? '0' : '0.75rem',
                margin: isCurrentHour ? '0.25rem 0.125rem' : '0', // Add margin for current hour
                backgroundColor: isCurrentHour 
                  ? 'rgba(52, 152, 219, 0.2)' 
                  : index % 2 === 0 ? 'rgba(31, 41, 55, 0.1)' : 'transparent',
                borderRadius: isCurrentHour ? '0.75rem' : index % 2 === 0 ? '0.5rem' : '0',
                minHeight: '7rem',
                justifyContent: 'space-between',
                border: isCurrentHour ? '2px solid rgba(52, 152, 219, 0.4)' : 'none',
                boxShadow: isCurrentHour ? '0 4px 8px rgba(52, 152, 219, 0.1)' : 'none',
                transform: isCurrentHour ? 'scale(1.02)' : 'scale(1)', // Reduce scale to prevent clipping
                transition: 'all 0.2s ease-in-out'
              }}
            >              <div style={{
                fontSize: '0.875rem',
                fontWeight: isCurrentHour ? 600 : 500,
                color: isCurrentHour ? '#3498db' : '#d1d5db',
                height: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '3rem',
                lineHeight: '1',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {isCurrentHour ? 'Now' : formatTime(hour.time)}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '2.5rem', // Fixed height for icon container
                width: '2.5rem',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  inset: '-0.25rem',
                  borderRadius: '9999px',
                  backgroundColor: hour.condition.includes('clear') || hour.condition.includes('sun')
                    ? 'rgba(236, 201, 75, 0.1)'
                    : hour.condition.includes('cloud')
                      ? 'rgba(156, 163, 175, 0.1)'
                      : hour.condition.includes('rain')
                        ? 'rgba(52, 152, 219, 0.1)'
                        : 'transparent',
                  filter: 'blur(4px)'
                }}></div>
                <WeatherIcon condition={hour.condition} size={32} />
              </div>
              <div style={{
                fontWeight: 500,
                fontSize: '0.875rem',
                height: '1.25rem', // Fixed height for temperature
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: '1',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {formatTemperature(hour.temperature, temperatureUnit)}
              </div>
              <div style={{
                height: '1.25rem', // Fixed height for precipitation (even when empty)
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {hour.precipProbability > 0 && (                  <div style={{
                    fontSize: '0.75rem',
                    padding: '0.125rem 0.375rem',
                    borderRadius: '0.25rem',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    color: '#63b3ed',
                    lineHeight: '1'
                  }}>
                    {hour.precipProbability}%
                  </div>                )}
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
