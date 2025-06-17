import { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { CurrentWeather, DayForecast, HourForecast, Location } from '../types/weather.ts';
import { useSettings } from './SettingsContext.tsx';
import { fetchCurrentWeather, searchLocations } from '../services/weatherService.ts';

interface WeatherContextType {
  currentWeather: CurrentWeather | null;
  threeDayForecast: DayForecast[];
  sevenDayForecast: DayForecast[];
  hourlyForecast: HourForecast[];
  location: Location;
  isLoading: boolean;
  error: string | null;
  selectedDate: Date | null;
  refreshWeather: () => Promise<void>;
  searchLocation: (query: string) => Promise<void>;
  searchResults: Location[];
  searchForLocations: (query: string) => Promise<void>;
  clearSearchResults: () => void;
  selectLocation: (location: Location) => Promise<void>;
  selectDate: (date: Date | null) => void;
}

const defaultLocation: Location = {
  name: 'New York',
  country: 'United States',
  latitude: 40.7128,
  longitude: -74.006,
};

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

interface WeatherProviderProps {
  children: ReactNode;
}

export const WeatherProvider: React.FC<WeatherProviderProps> = ({ children }) => {
  const [currentWeather, setCurrentWeather] = useState<CurrentWeather | null>(null);
  const [threeDayForecast, setThreeDayForecast] = useState<DayForecast[]>([]);
  const [sevenDayForecast, setSevenDayForecast] = useState<DayForecast[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourForecast[]>([]);
  const [location, setLocation] = useState<Location>(() => {
    // Try to get stored location from localStorage
    const storedLocation = localStorage.getItem('weatherLocation');
    return storedLocation ? JSON.parse(storedLocation) : defaultLocation;
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const { temperatureUnit } = useSettings();
  const refreshWeather = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get current weather and daily forecast
      const data = await fetchCurrentWeather(location.latitude, location.longitude);
      
      if (data) {
        setCurrentWeather(data.current);
        setThreeDayForecast(data.daily.slice(0, 3));
        setSevenDayForecast(data.daily);
        setHourlyForecast(data.hourly);
      }
    } catch (err) {
      setError('Failed to fetch weather data. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [location.latitude, location.longitude]);const searchLocation = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the geocoding service
      const locations = await searchLocations(query);
      
      if (locations && locations.length > 0) {
        const newLocation = locations[0]; // Use the first result
        await selectLocation(newLocation);
      } else {
        setError('Location not found. Please try a different search term.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Failed to search for location. Please try again later.');
      console.error(err);
      setIsLoading(false);
    }
  };  const searchForLocations = useCallback(async (query: string) => {
    console.log("searchForLocations called with query:", query);
    if (query.trim().length < 3) {
      console.log("Query too short, clearing results");
      setSearchResults([]);
      return;
    }
    
    try {
      // Call the geocoding service
      console.log("Fetching locations for:", query);
      const locations = await searchLocations(query);
      console.log("Found locations:", locations);
      setSearchResults(locations);
    } catch (err) {
      console.error('Failed to search for locations:', err);
    }
  }, []);
  
  const clearSearchResults = useCallback(() => {
    setSearchResults([]);
  }, []);
  const selectDate = useCallback((date: Date | null) => {
    setSelectedDate(date);
  }, []);
  
  const selectLocation = useCallback(async (selectedLocation: Location) => {
    setIsLoading(true);
    setError(null);
    setLocation(selectedLocation);
    
    // Save to localStorage
    localStorage.setItem('weatherLocation', JSON.stringify(selectedLocation));
    
    // Clear search results
    setSearchResults([]);
    
    // Refresh weather with new location
    try {
      await refreshWeather();
    } catch (err) {
      setError('Failed to fetch weather for selected location.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [refreshWeather]);

  // Fetch weather data when component mounts or location/unit changes
  useEffect(() => {
    refreshWeather();
  }, [location, temperatureUnit]);
  return (
    <WeatherContext.Provider value={{ 
      currentWeather, 
      threeDayForecast, 
      sevenDayForecast, 
      hourlyForecast, 
      location, 
      isLoading, 
      error, 
      selectedDate,
      refreshWeather, 
      searchLocation,
      searchResults,
      searchForLocations,
      clearSearchResults,
      selectLocation,
      selectDate
    }}>
      {children}
    </WeatherContext.Provider>
  );
};
