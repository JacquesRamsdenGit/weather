import { MoonPhase, MoonData, ActivityConditions, ActivityRating, MarineData, TideInfo } from '../types/weather.ts';

// Calculate moon phase based on date
export const calculateMoonPhase = (date: Date): MoonData => {
  // Known new moon: January 29, 2025
  const knownNewMoon = new Date(2025, 0, 29);
  const lunarCycle = 29.53059; // days
  
  const timeDiff = date.getTime() - knownNewMoon.getTime();
  const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
  const age = ((daysDiff % lunarCycle) + lunarCycle) % lunarCycle;
  
  let phase: MoonPhase;
  const illumination = Math.abs(Math.cos((age / lunarCycle) * 2 * Math.PI)) * 100;
  
  if (age < 1.84566) phase = 'new';
  else if (age < 5.53699) phase = 'waxing-crescent';
  else if (age < 9.22831) phase = 'first-quarter';
  else if (age < 12.91963) phase = 'waxing-gibbous';
  else if (age < 16.61096) phase = 'full';
  else if (age < 20.30228) phase = 'waning-gibbous';
  else if (age < 23.99361) phase = 'last-quarter';
  else if (age < 27.68493) phase = 'waning-crescent';
  else phase = 'new';
  
  // Approximate moonrise and moonset (simplified calculation)
  const moonrise = new Date(date);
  moonrise.setHours(6 + Math.floor(age * 0.8), Math.floor((age * 0.8 % 1) * 60));
  
  const moonset = new Date(date);
  moonset.setHours(18 + Math.floor(age * 0.8), Math.floor((age * 0.8 % 1) * 60));
  
  return {
    phase,
    illumination: Math.round(illumination),
    age: Math.round(age * 10) / 10,
    rise: moonrise,
    set: moonset
  };
};

// Calculate activity conditions based on weather and environmental factors
export const calculateActivityConditions = (
  windSpeed: number,
  precipitation: number,
  pressure: number,
  moonPhase: MoonPhase,
  marineData?: MarineData
): ActivityConditions => {
  
  // Fishing conditions
  const fishingFactors: string[] = [];
  let fishingRating: ActivityRating = 'fair';
  
  // Moon phase affects fishing
  if (moonPhase === 'new' || moonPhase === 'full') {
    fishingFactors.push('Optimal moon phase');
    fishingRating = 'excellent';
  } else if (moonPhase === 'first-quarter' || moonPhase === 'last-quarter') {
    fishingFactors.push('Good moon phase');
    if (fishingRating === 'fair') fishingRating = 'good';
  }
  
  // Pressure affects fishing
  if (pressure > 1020) {
    fishingFactors.push('High pressure - stable conditions');
  } else if (pressure < 1000) {
    fishingFactors.push('Low pressure - fish may be less active');
    if (fishingRating === 'excellent') fishingRating = 'good';
    if (fishingRating === 'good') fishingRating = 'fair';
  }
  
  // Weather conditions
  if (precipitation > 0) {
    fishingFactors.push('Light rain can improve fishing');
    if (fishingRating === 'fair') fishingRating = 'good';
  }
  
  if (windSpeed > 15) {
    fishingFactors.push('High winds - challenging conditions');
    if (fishingRating === 'excellent') fishingRating = 'good';
    if (fishingRating === 'good') fishingRating = 'fair';
  }
  
  // Surfing conditions
  const surfingFactors: string[] = [];
  let surfingRating: ActivityRating = 'poor';
  
  if (marineData) {
    if (marineData.waveHeight >= 0.5 && marineData.waveHeight <= 3) {
      surfingFactors.push(`Good wave height: ${marineData.waveHeight.toFixed(1)}m`);
      surfingRating = 'good';
    } else if (marineData.waveHeight > 3) {
      surfingFactors.push(`Large waves: ${marineData.waveHeight.toFixed(1)}m - experienced surfers only`);
      surfingRating = 'fair';
    } else {
      surfingFactors.push(`Small waves: ${marineData.waveHeight.toFixed(1)}m`);
      surfingRating = 'poor';
    }
    
    if (windSpeed < 10) {
      surfingFactors.push('Light winds - clean conditions');
      if (surfingRating === 'good') surfingRating = 'excellent';    } else if (windSpeed > 20) {
      surfingFactors.push('Strong winds - choppy conditions');
      if (surfingRating === 'good') surfingRating = 'fair';
    }
  } else {
    surfingFactors.push('No wave data available');
  }
  
  // Boating conditions
  const boatingFactors: string[] = [];
  let boatingRating: ActivityRating = 'good';
  
  if (windSpeed < 5) {
    boatingFactors.push('Calm winds - ideal for boating');
    boatingRating = 'excellent';
  } else if (windSpeed > 15) {
    boatingFactors.push('Strong winds - use caution');
    boatingRating = 'fair';
  } else if (windSpeed > 25) {
    boatingFactors.push('Very strong winds - not recommended');
    boatingRating = 'poor';
  }
  
  if (marineData && marineData.waveHeight > 2) {
    boatingFactors.push('Large waves - rough seas');
    if (boatingRating === 'excellent') boatingRating = 'good';
    if (boatingRating === 'good') boatingRating = 'fair';
  }
  
  if (precipitation > 0) {
    boatingFactors.push('Precipitation - reduced visibility');
    if (boatingRating === 'excellent') boatingRating = 'good';
  }
  
  return {
    fishing: { rating: fishingRating, factors: fishingFactors },
    surfing: { rating: surfingRating, factors: surfingFactors },
    boating: { rating: boatingRating, factors: boatingFactors }
  };
};

// Check if location is coastal based on coordinates
export const isCoastalLocation = (latitude: number, longitude: number): boolean => {
  // This is a simplified check - in a real app you'd use a proper coastline database
  // For now, we'll assume locations near major coastlines are coastal
  const coastalRegions = [
    // US East Coast
    { latMin: 25, latMax: 45, lonMin: -85, lonMax: -65 },
    // US West Coast  
    { latMin: 32, latMax: 49, lonMin: -125, lonMax: -117 },
    // UK
    { latMin: 49, latMax: 61, lonMin: -11, lonMax: 2 },
    // Australia East Coast
    { latMin: -38, latMax: -10, lonMin: 145, lonMax: 155 },
    // Mediterranean
    { latMin: 30, latMax: 46, lonMin: -6, lonMax: 36 }
  ];
  
  return coastalRegions.some(region => 
    latitude >= region.latMin && latitude <= region.latMax &&
    longitude >= region.lonMin && longitude <= region.lonMax
  );
};

// Generate mock tide data (in a real app, you'd fetch from a tide API)
export const generateTideData = (_latitude: number, _longitude: number, date: Date): MarineData => {
  const baseTime = new Date(date);
  baseTime.setHours(0, 0, 0, 0);
  
  // Generate semi-realistic tide times (approximately 6 hours apart)
  const tides: TideInfo[] = [];
  for (let i = 0; i < 4; i++) {
    const tideTime = new Date(baseTime.getTime() + (i * 6.25 * 60 * 60 * 1000));
    tides.push({
      time: tideTime,
      height: 1.5 + Math.sin(i * Math.PI / 2) * 1.2,
      type: (i % 2 === 0 ? 'high' : 'low') as 'high' | 'low'
    });
  }
  
  // Find current and next tides
  const now = new Date();
  const futureTides = tides.filter(tide => tide.time > now);
  const currentTide = tides.find(tide => 
    Math.abs(tide.time.getTime() - now.getTime()) === 
    Math.min(...tides.map(t => Math.abs(t.time.getTime() - now.getTime())))
  ) || tides[0];
  
  return {
    waveHeight: 0.5 + Math.random() * 2, // 0.5 to 2.5 meters
    waveDirection: Math.floor(Math.random() * 360),
    wavePeriod: 8 + Math.random() * 6, // 8 to 14 seconds
    currentTide,
    nextTides: futureTides.slice(0, 3),
    waterTemperature: 15 + Math.random() * 15 // 15-30°C
  };
};

export const getMoonPhaseIcon = (phase: MoonPhase): string => {
  const icons: Record<MoonPhase, string> = {
    'new': '🌑',
    'waxing-crescent': '🌒',
    'first-quarter': '🌓',
    'waxing-gibbous': '🌔',
    'full': '🌕',
    'waning-gibbous': '🌖',
    'last-quarter': '🌗',
    'waning-crescent': '🌘'
  };
  return icons[phase];
};

export const getActivityRatingColor = (rating: ActivityRating): string => {
  const colors: Record<ActivityRating, string> = {
    'poor': '#ef4444',
    'fair': '#f59e0b',
    'good': '#10b981',
    'excellent': '#3b82f6'
  };
  return colors[rating];
};
