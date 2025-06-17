import { useWeather } from '../../context/WeatherContext.tsx';
import { getMoonPhaseIcon, getActivityRatingColor } from '../../utils/moonAndActivities.ts';
import { formatTime } from '../../utils/formatters.ts';

const MoonAndActivityInfo = () => {
  const { currentWeather, selectedDate, threeDayForecast, sevenDayForecast } = useWeather();
    // If a date is selected, find the corresponding day data
  const displayData = selectedDate ? (() => {
    const selectedDateStr = selectedDate.toDateString();
    const dayData = [...threeDayForecast, ...sevenDayForecast].find(day => 
      day.date.toDateString() === selectedDateStr
    );
    
    if (dayData) {
      // Use the complete day data which now includes moon, marine, and activity data
      return {
        ...currentWeather,
        moonData: dayData.moonData,
        marineData: dayData.marineData,
        activityConditions: dayData.activityConditions,
        sunrise: dayData.sunrise,
        sunset: dayData.sunset
      };
    }
    return currentWeather;
  })() : currentWeather;
  
  if (!displayData) return null;

  const { moonData, marineData, activityConditions } = displayData;

  return (
    <div style={{
      backgroundColor: 'rgba(30, 30, 30, 0.7)',
      backdropFilter: 'blur(10px)',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginTop: '1rem'
    }}>
      {/* Moon Information */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#f5f5f7',
          marginBottom: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          🌙 Moon Phase
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
          gap: '1rem',
          marginBottom: '0.75rem'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0.75rem',
            backgroundColor: 'rgba(55, 65, 81, 0.3)',
            borderRadius: '0.5rem'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
              {getMoonPhaseIcon(moonData.phase)}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#d1d5db', textAlign: 'center' }}>
              {moonData.phase.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0.75rem',
            backgroundColor: 'rgba(55, 65, 81, 0.3)',
            borderRadius: '0.5rem'
          }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f5f5f7' }}>
              {moonData.illumination}%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Illuminated
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0.75rem',
            backgroundColor: 'rgba(55, 65, 81, 0.3)',
            borderRadius: '0.5rem'
          }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f5f5f7' }}>
              {moonData.age}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              Days old
            </div>
          </div>
        </div>
          {/* Sun times */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.875rem',
          color: '#f5c842',
          marginBottom: '0.5rem',
          padding: '0.5rem',
          backgroundColor: 'rgba(245, 200, 66, 0.1)',
          borderRadius: '0.375rem'
        }}>          <span>☀️ Sunrise: {formatTime(displayData.sunrise)}</span>
          <span>🌅 Sunset: {formatTime(displayData.sunset)}</span>
        </div>
        
        {/* Moon times */}
        {moonData.rise && moonData.set && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.875rem',
            color: '#d1d5db'
          }}>
            <span>� Moonrise: {formatTime(moonData.rise)}</span>
            <span>� Moonset: {formatTime(moonData.set)}</span>
          </div>
        )}
      </div>

      {/* Marine Data (if coastal location) */}
      {marineData && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#f5f5f7',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🌊 Marine Conditions
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '1rem',
            marginBottom: '0.75rem'
          }}>
            <div style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(55, 65, 81, 0.3)',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#3b82f6' }}>
                {marineData.waveHeight.toFixed(1)}m
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                Wave Height
              </div>
            </div>
            
            <div style={{
              padding: '0.75rem',
              backgroundColor: 'rgba(55, 65, 81, 0.3)',
              borderRadius: '0.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#3b82f6' }}>
                {marineData.wavePeriod.toFixed(0)}s
              </div>
              <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                Wave Period
              </div>
            </div>
            
            {marineData.waterTemperature && (
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(55, 65, 81, 0.3)',
                borderRadius: '0.5rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#10b981' }}>
                  {marineData.waterTemperature.toFixed(0)}°C
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                  Water Temp
                </div>
              </div>
            )}
          </div>
          
          {/* Current Tide */}
          <div style={{
            padding: '0.75rem',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '0.5rem',
            marginBottom: '0.75rem'
          }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#3b82f6', marginBottom: '0.25rem' }}>
              Current Tide: {marineData.currentTide.type === 'high' ? '🔼 High' : '🔽 Low'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#d1d5db' }}>
              Height: {marineData.currentTide.height.toFixed(1)}m at {formatTime(marineData.currentTide.time)}
            </div>
          </div>
          
          {/* Next Tides */}
          {marineData.nextTides.length > 0 && (
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#f5f5f7', marginBottom: '0.5rem' }}>
                Next Tides:
              </div>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                fontSize: '0.75rem',
                color: '#d1d5db'
              }}>
                {marineData.nextTides.slice(0, 3).map((tide, index) => (
                  <span key={index} style={{
                    padding: '0.25rem 0.5rem',
                    backgroundColor: 'rgba(55, 65, 81, 0.3)',
                    borderRadius: '0.25rem'
                  }}>
                    {tide.type === 'high' ? '🔼' : '🔽'} {formatTime(tide.time)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Activity Conditions */}
      {activityConditions && (
        <div>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: 600,
            color: '#f5f5f7',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            🎯 Activity Conditions
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {/* Fishing */}
            <div style={{
              padding: '1rem',
              backgroundColor: 'rgba(55, 65, 81, 0.3)',
              borderRadius: '0.5rem',
              border: `2px solid ${getActivityRatingColor(activityConditions.fishing.rating)}40`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span style={{ fontSize: '1rem', fontWeight: 600 }}>🎣 Fishing</span>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: getActivityRatingColor(activityConditions.fishing.rating),
                  textTransform: 'uppercase'
                }}>
                  {activityConditions.fishing.rating}
                </span>
              </div>
              <ul style={{
                fontSize: '0.75rem',
                color: '#d1d5db',
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {activityConditions.fishing.factors.map((factor, index) => (
                  <li key={index} style={{ marginBottom: '0.25rem' }}>• {factor}</li>
                ))}
              </ul>
            </div>

            {/* Surfing */}
            {marineData && (
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(55, 65, 81, 0.3)',
                borderRadius: '0.5rem',
                border: `2px solid ${getActivityRatingColor(activityConditions.surfing.rating)}40`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '1rem', fontWeight: 600 }}>🏄 Surfing</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: getActivityRatingColor(activityConditions.surfing.rating),
                    textTransform: 'uppercase'
                  }}>
                    {activityConditions.surfing.rating}
                  </span>
                </div>
                <ul style={{
                  fontSize: '0.75rem',
                  color: '#d1d5db',
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {activityConditions.surfing.factors.map((factor, index) => (
                    <li key={index} style={{ marginBottom: '0.25rem' }}>• {factor}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Boating */}
            {marineData && (
              <div style={{
                padding: '1rem',
                backgroundColor: 'rgba(55, 65, 81, 0.3)',
                borderRadius: '0.5rem',
                border: `2px solid ${getActivityRatingColor(activityConditions.boating.rating)}40`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontSize: '1rem', fontWeight: 600 }}>⛵ Boating</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: getActivityRatingColor(activityConditions.boating.rating),
                    textTransform: 'uppercase'
                  }}>
                    {activityConditions.boating.rating}
                  </span>
                </div>
                <ul style={{
                  fontSize: '0.75rem',
                  color: '#d1d5db',
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  {activityConditions.boating.factors.map((factor, index) => (
                    <li key={index} style={{ marginBottom: '0.25rem' }}>• {factor}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MoonAndActivityInfo;
