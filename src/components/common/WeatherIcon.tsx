import React from "react";
import { WeatherCondition } from "../../types/weather.ts";
import {
  SunIcon,
  MoonIcon,
  CloudIcon,
  CloudSunIcon,
  CloudMoonIcon,
  CloudRainIcon,
  CloudSnowIcon,
  CloudFogIcon,
  LightningBoltIcon,
} from "./WeatherIcons.tsx";

interface WeatherIconProps {
  condition: WeatherCondition;
  size?: number;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  size = 24,
  className = "",
}) => {
  // Format condition for display and accessibility
  const formatCondition = (condition: string): string => {
    return condition.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };
  
  const getIcon = () => {
    switch (condition) {
      case "clear-day":
        return (
          <SunIcon size={size} className={`text-secondary ${className}`} />
        );
      case "clear-night":
        return (
          <MoonIcon size={size} className={`text-gray-300 ${className}`} />
        );
      case "partly-cloudy-day":
        return (
          <CloudSunIcon size={size} className={`text-secondary ${className}`} />
        );
      case "partly-cloudy-night":
        return (
          <CloudMoonIcon size={size} className={`text-gray-300 ${className}`} />
        );
      case "cloudy":
        return (
          <CloudIcon size={size} className={`text-gray-400 ${className}`} />
        );
      case "rain":
        return (
          <CloudRainIcon size={size} className={`text-primary ${className}`} />
        );
      case "snow":
        return (
          <CloudSnowIcon size={size} className={`text-gray-200 ${className}`} />
        );
      case "sleet":
        return (
          <CloudSnowIcon size={size} className={`text-gray-300 ${className}`} />
        );
      case "wind":
        return (
          <CloudIcon size={size} className={`text-gray-400 ${className}`} />
        );
      case "fog":
        return (
          <CloudFogIcon size={size} className={`text-gray-400 ${className}`} />
        );
      case "thunderstorm":
        return (
          <LightningBoltIcon
            size={size}
            className={`text-secondary ${className}`}
          />
        );
      default:
        return (
          <CloudIcon size={size} className={`text-gray-400 ${className}`} />
        );
    }
  };
  return (
    <div 
      style={{ width: size, height: size }} 
      title={formatCondition(condition)}
      aria-label={formatCondition(condition)}
      role="img"
      className="relative group"
    >
      {getIcon()}
      <span className="absolute left-1/2 -translate-x-1/2 bottom-full -translate-y-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
        {formatCondition(condition)}
      </span>
    </div>
  );
};

export default WeatherIcon;
