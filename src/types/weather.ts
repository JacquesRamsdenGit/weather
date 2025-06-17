export type WeatherCondition = 
  'clear-day' | 'clear-night' | 'partly-cloudy-day' | 'partly-cloudy-night' | 
  'cloudy' | 'rain' | 'snow' | 'sleet' | 'wind' | 'fog' | 'thunderstorm';

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export type ForecastType = 'hourly' | 'three-day' | 'seven-day';

export type MoonPhase = 'new' | 'waxing-crescent' | 'first-quarter' | 'waxing-gibbous' | 
  'full' | 'waning-gibbous' | 'last-quarter' | 'waning-crescent';

export type TideType = 'high' | 'low';

export type ActivityRating = 'poor' | 'fair' | 'good' | 'excellent';

export interface Location {
  name: string;
  country: string;
  state?: string;
  latitude: number;
  longitude: number;
  isCoastal?: boolean;
}

export interface MoonData {
  phase: MoonPhase;
  illumination: number; // 0-100%
  age: number; // days since new moon
  rise: Date | null;
  set: Date | null;
}

export interface TideInfo {
  time: Date;
  height: number; // in meters
  type: TideType;
}

export interface MarineData {
  waveHeight: number; // in meters
  waveDirection: number; // degrees
  wavePeriod: number; // seconds
  currentTide: TideInfo;
  nextTides: TideInfo[];
  waterTemperature?: number;
}

export interface ActivityConditions {
  fishing: {
    rating: ActivityRating;
    factors: string[];
  };
  surfing: {
    rating: ActivityRating;
    factors: string[];
  };
  boating: {
    rating: ActivityRating;
    factors: string[];
  };
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  precipitation: number;
  lastUpdated: Date;
  sunrise: Date;
  sunset: Date;
  high: number;
  low: number;
  moonData: MoonData;
  marineData?: MarineData;
  activityConditions?: ActivityConditions;
}

export interface DayForecast {
  date: Date;
  highTemp: number;
  lowTemp: number;
  condition: WeatherCondition;
  precipProbability: number;
  sunrise: Date;
  sunset: Date;
  windSpeed: number;
  windDirection: number;
  humidity: number;
  pressure: number;
  uvIndex: number;
  visibility: number;
  moonData: MoonData;
  marineData?: MarineData;
  activityConditions?: ActivityConditions;
}

export interface HourForecast {
  time: Date;
  temperature: number;
  condition: WeatherCondition;
  precipProbability: number;
  activityConditions?: ActivityConditions;
}

export interface WeatherApiResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weather_code: number;
    pressure_msl: number;
    surface_pressure: number;
    cloud_cover: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    relative_humidity_2m: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_probability_max: number[];
    weather_code: number[];
    wind_speed_10m_max: number[];
    wind_direction_10m_dominant: number[];
    uv_index_max: number[];
  };  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
    wind_speed_10m: number[];
    precipitation: number[];
  };
}
