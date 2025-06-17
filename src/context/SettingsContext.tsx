import { createContext, useState, useContext, ReactNode } from 'react';
import { TemperatureUnit } from '../types/weather.ts';

interface SettingsContextType {
  temperatureUnit: TemperatureUnit;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [temperatureUnit, setTemperatureUnitState] = useState<TemperatureUnit>(() => {
    // Try to get stored preference from localStorage
    const storedUnit = localStorage.getItem('temperatureUnit');
    return (storedUnit === 'celsius' || storedUnit === 'fahrenheit') 
      ? storedUnit as TemperatureUnit 
      : 'celsius';
  });

  const setTemperatureUnit = (unit: TemperatureUnit) => {
    setTemperatureUnitState(unit);
    // Store preference in localStorage
    localStorage.setItem('temperatureUnit', unit);
  };

  return (
    <SettingsContext.Provider value={{ temperatureUnit, setTemperatureUnit }}>
      {children}
    </SettingsContext.Provider>
  );
};
