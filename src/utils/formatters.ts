import { TemperatureUnit } from "../types/weather.ts";

export const formatTemperature = (temp: number, unit: TemperatureUnit): string => {
  if (unit === 'fahrenheit') {
    const fahrenheit = (temp * 9/5) + 32;
    return `${Math.round(fahrenheit)}°F`;
  }
  
  return `${Math.round(temp)}°C`;
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const formatDay = (date: Date): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }
  
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  
  return new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: true,
  }).format(date);
};
