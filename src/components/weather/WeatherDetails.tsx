import { useWeather } from '../../context/WeatherContext.tsx';

const WeatherDetails= () => {
  const { currentWeather, isLoading } = useWeather();
  
  if (isLoading || !currentWeather) {
    return (
      <div className="glass-card p-4 mt-6 animate-pulse">
        <div className="h-32 bg-gray-700/50 rounded-lg"></div>
      </div>
    );
  }
  
  const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const getUVIndexDescription = (index: number): string => {
    if (index <= 2) return 'Low';
    if (index <= 5) return 'Moderate';
    if (index <= 7) return 'High';
    if (index <= 10) return 'Very High';
    return 'Extreme';
  };
    const getUVIndexColor = (index: number): string => {
    if (index <= 2) return '#2ecc71';
    if (index <= 5) return '#f39c12';
    if (index <= 7) return '#e67e22';
    if (index <= 10) return '#e74c3c';
    return '#c0392b';
  };  
  
  return (
    <div style={{
      backgroundColor: 'rgba(30, 30, 30, 0.7)',
      backdropFilter: 'blur(10px)',
      padding: '1rem',
      marginTop: '1rem',
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '0.5rem'
    }}>
      <div style={{
        position: 'absolute',
        top: '-5rem',
        left: '-5rem',
        width: '10rem',
        height: '10rem',
        borderRadius: '9999px',
        backgroundColor: 'rgba(236, 201, 75, 0.05)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-5rem',
        right: '-5rem',
        width: '10rem',
        height: '10rem',
        borderRadius: '9999px',
        backgroundColor: 'rgba(52, 152, 219, 0.05)',
        filter: 'blur(60px)',
        pointerEvents: 'none'
      }}></div>
      
      <h2 style={{
        fontSize: '1.125rem',
        marginBottom: '0.75rem',
        fontWeight: 500,
        color: '#f5f5f7'
      }}>Weather Details</h2>
        <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth >= 768 ? 'repeat(4, minmax(0, 1fr))' : 
                            window.innerWidth >= 640 ? 'repeat(3, minmax(0, 1fr))' :
                            'repeat(2, minmax(0, 1fr))',
        gap: '1rem'
      }}>
        {/* Humidity */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(31, 41, 55, 0.2)',
          padding: '0.75rem',
          borderRadius: '0.5rem'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 500
          }}>Humidity</div>
          <div style={{
            fontSize: '1.125rem',
            fontWeight: 500,
            marginTop: '0.25rem'
          }}>{currentWeather.humidity}%</div>
        </div>
        
        {/* Wind */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(31, 41, 55, 0.2)',
          padding: '0.75rem',
          borderRadius: '0.5rem'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 500
          }}>Wind</div>
          <div style={{
            fontSize: '1.125rem',
            fontWeight: 500,
            marginTop: '0.25rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            {currentWeather.windSpeed} km/h
            <span style={{
              fontSize: '0.875rem',
              color: '#9ca3af',
              marginLeft: '0.25rem'
            }}>
              {getWindDirection(currentWeather.windDirection)}
            </span>
          </div>
        </div>
        
        {/* Pressure */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(31, 41, 55, 0.2)',
          padding: '0.75rem',
          borderRadius: '0.5rem'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 500
          }}>Pressure</div>
          <div style={{
            fontSize: '1.125rem',
            fontWeight: 500,
            marginTop: '0.25rem'
          }}>{currentWeather.pressure} hPa</div>
        </div>
        
        {/* UV Index */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(31, 41, 55, 0.2)',
          padding: '0.75rem',
          borderRadius: '0.5rem'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 500
          }}>UV Index</div>
          <div style={{
            fontSize: '1.125rem',
            fontWeight: 500,
            marginTop: '0.25rem',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{
              color: getUVIndexColor(currentWeather.uvIndex),
              fontWeight: 600
            }}>
              {currentWeather.uvIndex}
            </span>
            <span style={{
              fontSize: '0.875rem',
              color: '#9ca3af',
              marginLeft: '0.5rem',
              backgroundColor: 'rgba(31, 41, 55, 0.3)',
              padding: '0 0.5rem',
              borderRadius: '0.25rem'
            }}>
              {getUVIndexDescription(currentWeather.uvIndex)}
            </span>
          </div>
        </div>
        
        {/* Visibility */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(31, 41, 55, 0.2)',
          padding: '0.75rem',
          borderRadius: '0.5rem'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 500
          }}>Visibility</div>
          <div style={{
            fontSize: '1.125rem',
            fontWeight: 500,
            marginTop: '0.25rem'
          }}>
            {(currentWeather.visibility / 1000).toFixed(1)} km
          </div>
        </div>
        
        {/* Precipitation */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'rgba(31, 41, 55, 0.2)',
          padding: '0.75rem',
          borderRadius: '0.5rem'
        }}>
          <div style={{
            fontSize: '0.75rem',
            color: '#9ca3af',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: 500
          }}>Precipitation</div>
          <div style={{
            fontSize: '1.125rem',
            fontWeight: 500,
            marginTop: '0.25rem'
          }}>
            {currentWeather.precipitation} mm
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails;
