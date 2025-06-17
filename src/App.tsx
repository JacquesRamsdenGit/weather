import { useState } from 'react'
import Header from './components/layout/Header.tsx'
import CurrentWeather from './components/weather/CurrentWeather.tsx'
import ForecastToggle from './components/weather/ForecastToggle.tsx'
import HourlyForecast from './components/weather/HourlyForecast.tsx'
import ThreeDayForecast from './components/weather/ThreeDayForecast.tsx'
import SevenDayForecast from './components/weather/SevenDayForecast.tsx'
import WeatherDetails from './components/weather/WeatherDetails.tsx'
import MoonAndActivityInfo from './components/weather/MoonAndActivityInfo.tsx'
import { ForecastType } from './types/weather.ts'

function App() {
  const [forecastType, setForecastType] = useState<ForecastType>('hourly')

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(to bottom right, #1a1a1a, #121212, #1a1a1a)',
      color: '#f5f5f7',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at top, rgba(52, 152, 219, 0.1), transparent 60%)',
        pointerEvents: 'none'
      }}></div>
      
      <Header />
      
      <main style={{
        position: 'relative',
        zIndex: 10,
        flex: 1,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <CurrentWeather />
        
        <div style={{ margin: '1.5rem 0' }}>
          <ForecastToggle 
            forecastType={forecastType} 
            onToggle={setForecastType} 
          />
          
          {forecastType === 'hourly' ? (
            <HourlyForecast />
          ) : forecastType === 'three-day' ? (
            <ThreeDayForecast />
          ) : (
            <SevenDayForecast />
          )}        </div>
        
        <MoonAndActivityInfo />
        
        <WeatherDetails />
      </main>
    </div>
  )
}

export default App
