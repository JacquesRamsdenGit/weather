import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { WeatherProvider } from './context/WeatherContext.tsx'
import { SettingsProvider } from './context/SettingsContext.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SettingsProvider>
      <WeatherProvider>
        <App />
      </WeatherProvider>
    </SettingsProvider>
  </React.StrictMode>,
)
