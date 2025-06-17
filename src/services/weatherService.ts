import axios from 'axios';
import { CurrentWeather, WeatherApiResponse, WeatherCondition, Location } from '../types/weather.ts';
import { calculateMoonPhase, calculateActivityConditions, isCoastalLocation, generateTideData } from '../utils/moonAndActivities.ts';

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';
const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

// Convert weather code to our app's weather condition type
const mapWeatherCode = (code: number, isDay: boolean = true): WeatherCondition => {
  // WMO Weather codes mapping: https://open-meteo.com/en/docs
  switch (code) {
    case 0: 
      return isDay ? 'clear-day' : 'clear-night';
    case 1:
    case 2:
      return isDay ? 'partly-cloudy-day' : 'partly-cloudy-night';
    case 3:
      return 'cloudy';
    case 45:
    case 48:
      return 'fog';
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
    case 80:
    case 81:
    case 82:
      return 'rain';
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
      return 'snow';
    case 95:
    case 96:
    case 99:
      return 'thunderstorm';
    default:
      return 'cloudy';
  }
};

export const fetchCurrentWeather = async (latitude: number, longitude: number) => {  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,pressure_msl,surface_pressure,cloud_cover,wind_speed_10m,wind_direction_10m,relative_humidity_2m',
    hourly: 'temperature_2m,weather_code,precipitation_probability,wind_speed_10m,precipitation',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max,wind_direction_10m_dominant,uv_index_max',
    timezone: 'auto',
    forecast_days: '7'
  }).toString();
  try {
    const response = await axios.get<WeatherApiResponse>(`${WEATHER_API_URL}?${params}`);
    const data = response.data;
      // Calculate additional data
    const moonData = calculateMoonPhase(new Date());
    const coastal = isCoastalLocation(latitude, longitude);
    const marineData = coastal ? generateTideData(latitude, longitude, new Date()) : undefined;
    
    // Process current weather
    const current: CurrentWeather = {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      condition: mapWeatherCode(data.current.weather_code, data.current.is_day === 1),
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      pressure: data.current.pressure_msl,
      visibility: 10000 * (1 - data.current.cloud_cover / 100), // Estimate visibility based on cloud cover
      uvIndex: data.daily.uv_index_max[0],
      precipitation: data.current.precipitation,
      lastUpdated: new Date(),
      sunrise: new Date(data.daily.sunrise[0]),
      sunset: new Date(data.daily.sunset[0]),
      high: data.daily.temperature_2m_max[0],
      low: data.daily.temperature_2m_min[0],
      moonData,
      marineData,
      activityConditions: calculateActivityConditions(
        data.current.wind_speed_10m,
        data.current.precipitation,
        data.current.pressure_msl,
        moonData.phase,
        marineData
      )
    };    // Process daily forecast
    const daily = data.daily.time.map((time, index) => {
      const dayDate = new Date(time);
      const dayMoonData = calculateMoonPhase(dayDate);
      const dayMarineData = coastal ? generateTideData(latitude, longitude, dayDate) : undefined;
      const dayActivityConditions = calculateActivityConditions(
        data.daily.wind_speed_10m_max[index],
        data.daily.precipitation_probability_max[index] || 0, // Use precipitation probability as sum not available
        data.current.pressure_msl, // Use current pressure as daily average not available
        dayMoonData.phase,
        dayMarineData
      );
      
      return {
        date: dayDate,
        highTemp: data.daily.temperature_2m_max[index],
        lowTemp: data.daily.temperature_2m_min[index],
        condition: mapWeatherCode(data.daily.weather_code[index], true),
        precipProbability: data.daily.precipitation_probability_max[index],
        sunrise: new Date(data.daily.sunrise[index]),
        sunset: new Date(data.daily.sunset[index]),
        windSpeed: data.daily.wind_speed_10m_max[index],
        windDirection: data.daily.wind_direction_10m_dominant[index] || data.current.wind_direction_10m,
        humidity: 70, // Approximate value as daily humidity not available in this API
        pressure: data.current.pressure_msl, // Use current pressure as daily not available
        uvIndex: data.daily.uv_index_max[index] || 0,
        visibility: 10, // Approximate value as visibility not available
        moonData: dayMoonData,
        marineData: dayMarineData,
        activityConditions: dayActivityConditions
      };
    });// Process hourly forecast (next 24 hours)
    const hourly = data.hourly.time.slice(0, 24).map((time, index) => {
      const hourMoonData = calculateMoonPhase(new Date(time));
      const hourActivityConditions = calculateActivityConditions(
        data.hourly.wind_speed_10m[index] || data.current.wind_speed_10m,
        data.hourly.precipitation[index] || 0,
        data.current.pressure_msl,
        hourMoonData.phase,
        marineData
      );
      
      return {
        time: new Date(time),
        temperature: data.hourly.temperature_2m[index],
        condition: mapWeatherCode(data.hourly.weather_code[index], 
          new Date(time).getHours() >= 6 && new Date(time).getHours() <= 18),
        precipProbability: data.hourly.precipitation_probability[index],
        activityConditions: hourActivityConditions
      };
    });
    
    return {
      current,
      daily,
      hourly
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const fetchForecast = async (latitude: number, longitude: number) => {
  return fetchCurrentWeather(latitude, longitude);
};

export const searchLocations = async (query: string): Promise<Location[]> => {
  if (!query || query.trim().length < 3) {
    console.log('Query too short, skipping API call');
    return [];
  }
  
  const queryString = `${GEO_API_URL}?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  console.log(`Making API call to: ${queryString}`);
  
  try {
    const response = await axios.get(queryString);
    console.log('API response:', response.data);
    
    // Process and map the response data to our Location type
    if (response.data && response.data.results) {
      const locations = response.data.results.map((item: any) => ({
        name: item.name,
        country: item.country,
        state: item.admin1,
        latitude: item.latitude,
        longitude: item.longitude
      }));
      
      console.log('Parsed locations:', locations);
      return locations;
    }
    
    console.log('No results found');
    return [];
  } catch (error) {
    console.error('Error searching locations:', error);
    return [];
  }
};
