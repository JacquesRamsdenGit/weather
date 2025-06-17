import { useState, useEffect, useRef, useCallback } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useWeather } from '../../context/WeatherContext.tsx';
import { useSettings } from '../../context/SettingsContext.tsx';
import { Location } from '../../types/weather.ts';

const Header = () => {
  const { 
    location, 
    searchLocation, 
    error, 
    isLoading,
    searchResults,
    searchForLocations,
    clearSearchResults,
    selectLocation,
    selectedDate,
    selectDate
  } = useWeather();
  const { temperatureUnit, setTemperatureUnit } = useSettings();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  // Handle clicks outside the search container to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Create a debounced search function
  const debouncedSearch = useCallback((query: string) => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Don't search if query is empty or too short
    if (!query || query.trim().length < 3) {
      clearSearchResults();
      return;
    }
    
    // Set a new timeout
    searchTimeoutRef.current = setTimeout(() => {
      console.log("Searching for:", query);
      searchForLocations(query);
    }, 500);
  }, [searchForLocations, clearSearchResults]);

  // Handle input change
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log("Input changed to:", value);
    setSearchQuery(value);
    
    // Update dropdown visibility based on input length
    if (!value || value.trim().length < 3) {
      setDropdownVisible(false);
      clearSearchResults();
    }
    
    // Trigger debounced search
    debouncedSearch(value);
  }, [debouncedSearch, clearSearchResults]);

  // Update dropdown visibility when search results change
  useEffect(() => {
    console.log("Search results updated:", searchResults);
    if (searchResults?.length > 0 && searchQuery.trim().length >= 3) {
      setDropdownVisible(true);
    } else if (searchResults?.length === 0 && searchQuery.trim().length >= 3) {
      setDropdownVisible(false);
    }
  }, [searchResults, searchQuery]);

  // Form submission handler
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (searchResults?.length > 0) {
        // Use the first result if we have search results
        selectLocation(searchResults[0]);
      } else {
        // Otherwise use the direct search
        searchLocation(searchQuery);
      }
      setSearchQuery('');
      setDropdownVisible(false);
    }
  }, [searchQuery, searchResults, selectLocation, searchLocation]);
  
  const handleSelectLocation = useCallback((selectedLocation: Location) => {
    console.log("Selected location:", selectedLocation);
    selectLocation(selectedLocation);
    setSearchQuery('');
    setDropdownVisible(false);
  }, [selectLocation]);
  
  const handleInputFocus = useCallback(() => {
    if (searchQuery.trim().length >= 3 && searchResults?.length > 0) {
      setDropdownVisible(true);
    }
  }, [searchQuery, searchResults]);
  
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    clearSearchResults();
    setDropdownVisible(false);
  }, [clearSearchResults]);

  const toggleTemperatureUnit = useCallback(() => {
    setTemperatureUnit(temperatureUnit === 'celsius' ? 'fahrenheit' : 'celsius');
  }, [temperatureUnit, setTemperatureUnit]);
  
  return (
    <header style={{
      backgroundColor: 'rgba(30, 30, 30, 0.7)',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
      borderBottom: '1px solid rgba(107, 114, 128, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '0.75rem'
        }}>
          <h1 style={{
            fontSize: '1.875rem',
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 700,
            color: '#3498db',
            background: 'linear-gradient(to right, #3498db, #2ecc71)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Weather
          </h1>          <div style={{
            marginLeft: '1rem',
            color: '#e0e0e0',
            fontWeight: 500
          }}>
            {location.name}, {location.country}
          </div>
          
          {/* Date Indicator */}
          {selectedDate && (
            <div style={{
              marginLeft: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>              <span style={{
                color: '#3498db',
                fontSize: '0.875rem',
                fontWeight: 500
              }}>
                📅 {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: selectedDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                })}
              </span>
              <button
                onClick={() => selectDate(null)}
                style={{
                  background: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid #3b82f6',
                  borderRadius: '0.25rem',
                  color: '#3b82f6',
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.5rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                }}
              >
                Back to Today
              </button>
            </div>
          )}
        </div><div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          width: '100%',
          maxWidth: '24rem',
          justifyContent: 'center'
        }}>          <div 
            ref={searchContainerRef}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              width: '100%', 
              maxWidth: '18rem',
              position: 'relative',
              flexShrink: 1
            }}
          >
          <form onSubmit={handleSearch} style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search location..."
              value={searchQuery}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              style={{
                width: '100%',
                padding: '0.625rem 1rem',
                paddingRight: '2.5rem',
                borderRadius: dropdownVisible && searchResults?.length > 0 ? 
                  '0.5rem 0.5rem 0 0' : '0.5rem',
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                border: error ? '1px solid #ef4444' : '1px solid rgba(107, 114, 128, 0.3)',
                borderBottom: dropdownVisible && searchResults?.length > 0 ? 
                  '1px solid rgba(107, 114, 128, 0.2)' : 
                  error ? '1px solid #ef4444' : '1px solid rgba(107, 114, 128, 0.3)',
                color: '#f5f5f7',
                outline: 'none',
                boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s',
                fontSize: '0.875rem',
                zIndex: 51
              }}
              disabled={isLoading}
              data-testid="search-input"
            />
            {searchQuery ? (
              <button 
                type="button" 
                onClick={clearSearch}
                style={{
                  position: 'absolute',
                  right: '2rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  zIndex: 52
                }}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>            ) : null}
            <button 
              type="submit" 
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                zIndex: 52
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg style={{ animation: 'spin 1s linear infinite', height: '1rem', width: '1rem' }} viewBox="0 0 24 24">
                  <circle 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4" 
                    fill="none" 
                    strokeDasharray="32" 
                    strokeDashoffset="8" 
                  />
                </svg>
              ) : (
                <MagnifyingGlassIcon style={{ height: '1rem', width: '1rem' }} />
              )}
            </button>
          </form>
          
          {/* Search results dropdown */}
          {dropdownVisible && searchResults && searchResults.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              backgroundColor: 'rgba(31, 41, 55, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '0 0 0.5rem 0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              border: '1px solid rgba(107, 114, 128, 0.3)',
              borderTop: 'none',
              maxHeight: '15rem',
              overflowY: 'auto',
              zIndex: 50
            }}>
              {searchResults.map((result, index) => (
                <div 
                  key={`${result.name}-${result.latitude}-${result.longitude}`}
                  onClick={() => handleSelectLocation(result)}
                  style={{
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    borderBottom: index < searchResults.length - 1 ? 
                      '1px solid rgba(75, 85, 99, 0.2)' : 'none',                    transition: 'background-color 0.2s',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLDivElement).style.backgroundColor = 'rgba(55, 65, 81, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLDivElement).style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{ fontWeight: 500, color: '#f5f5f7' }}>
                    {result.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {result.state ? `${result.state}, ` : ''}{result.country}
                  </div>
                </div>
              ))}
            </div>          )}
          
          </div>
            <button
            onClick={toggleTemperatureUnit}
            style={{
              padding: '0.375rem 0.625rem',
              fontSize: '0.75rem',
              backgroundColor: 'rgba(55, 65, 81, 0.8)',
              border: '1px solid rgba(75, 85, 99, 0.6)',
              borderRadius: '0.25rem',
              color: '#f5f5f7',
              cursor: 'pointer',
              height: 'fit-content',
              marginTop: '0.25rem',
              flexShrink: 0,
              zIndex: 53,
              position: 'relative'
            }}
          >
            °{temperatureUnit === 'celsius' ? 'C' : 'F'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
