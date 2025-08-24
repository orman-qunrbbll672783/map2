import React, { useState, useEffect, useRef } from 'react';
import { getSavedBusinesses, saveBusinessToSupabase, removeSavedBusiness } from './supabaseClient';
import ProfileSection from './ProfileSection';

// Business type options for search
const BUSINESS_TYPES = [
  { id: 'startup', label: 'Startup', icon: '🚀' },
  { id: 'bakery', label: 'Bakery', icon: '🥖' },
  { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { id: 'real_estate', label: 'Real Estate', icon: '🏠' },
  { id: 'retail', label: 'Retail Store', icon: '🛍️' },
  { id: 'salon', label: 'Beauty Salon', icon: '💄' },
  { id: 'gym', label: 'Gym/Fitness', icon: '💪' },
  { id: 'cafe', label: 'Cafe', icon: '☕' },
  { id: 'dentist', label: 'Dental Office', icon: '🦷' },
  { id: 'law_firm', label: 'Law Firm', icon: '⚖️' },
  { id: 'accounting', label: 'Accounting', icon: '📊' },
  { id: 'marketing', label: 'Marketing Agency', icon: '📈' },
  { id: 'custom', label: 'Custom', icon: '✏️' }
];

// Digital Health Score calculation
const calculateDigitalHealthScore = (business) => {
  let score = 0;
  let maxScore = 100;

  // Website (30 points)
  if (business.website) score += 30;
  
  // Phone number (25 points)
  if (business.phone) score += 25;
  
  // Address (20 points)
  if (business.address) score += 20;
  
  // Photos (15 points)
  if (business.photos && business.photos.length > 0) score += 15;
  
  // Reviews (10 points)
  if (business.rating && business.rating > 0) score += 10;

  return Math.round((score / maxScore) * 100);
};

// Digital Health Score Badge Component
const HealthScoreBadge = ({ score }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreText = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${getScoreColor(score)}`}></div>
      <div className="text-sm">
        <span className="font-semibold">{score}%</span>
        <span className="text-neutral-500 ml-1">{getScoreText(score)}</span>
      </div>
    </div>
  );
};

// Business Card Component
const BusinessCard = ({ business, onViewDetails, onSave, onSocialSearch, isSaved, isSaving }) => {
  const healthScore = calculateDigitalHealthScore(business);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Business Image */}
      <div className="aspect-video bg-gradient-to-br from-primary-100 to-accent-100 relative overflow-hidden">
        {business.photos && business.photos.length > 0 ? (
          <img 
            src={business.photos[0]} 
            alt={business.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl opacity-50">🏢</div>
          </div>
        )}
        
        {/* Top right badges */}
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
            <HealthScoreBadge score={healthScore} />
          </div>
        </div>
        
        {/* Save button */}
        <div className="absolute top-3 left-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave(business);
            }}
            disabled={isSaving}
            className={`w-8 h-8 rounded-full backdrop-blur-sm border transition-all duration-200 flex items-center justify-center ${
              isSaving 
                ? 'bg-neutral-200 border-neutral-300 text-neutral-400 cursor-not-allowed'
                : isSaved 
                  ? 'bg-red-500 border-red-400 text-white shadow-lg hover:bg-red-600' 
                  : 'bg-white/90 border-white/20 text-neutral-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
            }`}
            title={isSaving ? 'Saving...' : isSaved ? 'Remove from saved' : 'Save business'}
          >
            {isSaving ? (
              <div className="w-3 h-3 border border-neutral-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.682l-1.318-1.364a4.5 4.5 0 00-6.364 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Business Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg text-neutral-800 line-clamp-2 flex-1">{business.name}</h3>
          {business.rating && (
            <div className="flex items-center space-x-1 ml-2">
              <span className="text-yellow-400">⭐</span>
              <span className="text-sm font-medium">{business.rating}</span>
            </div>
          )}
        </div>

        {/* Address */}
        {business.address && (
          <div className="flex items-start space-x-2 mb-3">
            <div className="text-neutral-400 mt-0.5">📍</div>
            <p className="text-sm text-neutral-600 line-clamp-2">{business.address}</p>
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          {business.phone && (
            <div className="flex items-center space-x-2">
              <div className="text-neutral-400">📞</div>
              <span className="text-sm text-neutral-600">{business.phone}</span>
            </div>
          )}
          {business.website && (
            <div className="flex items-center space-x-2">
              <div className="text-neutral-400">🌐</div>
              <a 
                href={business.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary-600 hover:text-primary-700 truncate"
              >
                {business.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onViewDetails(business)}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-accent-600 transition-all duration-300 hover:shadow-lg"
          >
            View Opportunities
          </button>
          
          <button
            onClick={() => onSocialSearch(business)}
            className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-all duration-200 flex items-center justify-center group"
            title="Search social media"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Search Filters Component
const SearchFilters = ({ filters, onFiltersChange }) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6">
      <h3 className="font-bold text-lg text-neutral-800 mb-4">Filters</h3>
      
      <div className="space-y-3">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.hasWebsite}
            onChange={(e) => onFiltersChange({ ...filters, hasWebsite: e.target.checked })}
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm">Has Website</span>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.hasPhone}
            onChange={(e) => onFiltersChange({ ...filters, hasPhone: e.target.checked })}
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm">Has Phone Number</span>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.hasAddress}
            onChange={(e) => onFiltersChange({ ...filters, hasAddress: e.target.checked })}
            className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
          />
          <span className="text-sm">Has Address</span>
        </label>
      </div>
    </div>
  );
};

// Main Freelancer Dashboard Component
const FreelancerDashboard = ({ userData, onLogout }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState([]);
  const [customBusinessType, setCustomBusinessType] = useState('');
  const [maxResults, setMaxResults] = useState(50);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapError, setMapError] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [savedBusinesses, setSavedBusinesses] = useState([]);
  const [loadingSavedBusinesses, setLoadingSavedBusinesses] = useState(true);
  const [savingBusiness, setSavingBusiness] = useState(null); // Track which business is being saved/unsaved
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeView, setActiveView] = useState('dashboard'); // 'dashboard' | 'saved' | 'profile'
  const [filters, setFilters] = useState({
    hasWebsite: false,
    hasPhone: false,
    hasAddress: false
  });



  // Handle business type selection (multiple)
  const toggleBusinessType = (typeId) => {
    setSelectedBusinessTypes(prev => {
      if (prev.includes(typeId)) {
        // Remove if already selected
        return prev.filter(id => id !== typeId);
      } else {
        // Add if not selected
        return [...prev, typeId];
      }
    });
  };

  // Clear all business type selections
  const clearBusinessTypes = () => {
    setSelectedBusinessTypes([]);
  };

  // Save/unsave business functionality with Supabase persistence
  const toggleSaveBusiness = async (business) => {
    console.log('🔖 Toggling save for business:', business.name);
    setSavingBusiness(business.id);
    
    try {
      const isAlreadySaved = savedBusinesses.find(b => b.id === business.id);
      
      if (isAlreadySaved) {
        // Remove from Supabase
        console.log('🗑️ Removing business from saved list...');
        const result = await removeSavedBusiness(business.id);
        
        if (result.success) {
          // Update local state
          setSavedBusinesses(prev => prev.filter(b => b.id !== business.id));
          console.log('✅ Business removed from saved list');
        } else {
          console.error('❌ Failed to remove business:', result.error);
          // Could show a toast notification here
        }
      } else {
        // Save to Supabase
        console.log('💾 Saving business to Supabase...');
        const result = await saveBusinessToSupabase(business);
        
        if (result.success) {
          // Update local state
          setSavedBusinesses(prev => [...prev, business]);
          console.log('✅ Business saved successfully');
        } else {
          console.error('❌ Failed to save business:', result.error);
          // Could show a toast notification here
        }
      }
    } catch (error) {
      console.error('❌ Error toggling save business:', error);
    } finally {
      setSavingBusiness(null);
    }
  };

  const isBusinessSaved = (businessId) => {
    return savedBusinesses.some(b => b.id === businessId);
  };

  // Social media search functionality
  const searchSocialMedia = (business) => {
    const query = `${business.name} ${business.address || ''} social media`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  // Mobile menu management
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  // Profile dropdown management
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.mobile-menu') && !event.target.closest('.hamburger-btn')) {
        setShowMobileMenu(false);
      }
      if (!event.target.closest('.profile-dropdown') && !event.target.closest('.profile-btn')) {
        setShowProfileDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debug: Log userData when component mounts
  useEffect(() => {
    console.log('FreelancerDashboard mounted with userData:', userData);
  }, [userData]);

  // Load saved businesses from Supabase on component mount
  useEffect(() => {
    const loadSavedBusinesses = async () => {
      console.log('🔖 Loading saved businesses from Supabase...');
      setLoadingSavedBusinesses(true);
      
      const result = await getSavedBusinesses();
      
      if (result.success) {
        console.log('✅ Loaded saved businesses:', result.data.length);
        setSavedBusinesses(result.data);
      } else {
        console.error('❌ Failed to load saved businesses:', result.error);
        setSavedBusinesses([]);
      }
      
      setLoadingSavedBusinesses(false);
    };
    
    loadSavedBusinesses();
  }, []);

  // Initialize map and get user location
  useEffect(() => {
    console.log('🗺️ Map initialization effect triggered');
    console.log('Environment variables check:');
    console.log('- REACT_APP_GOOGLE_MAPS_API_KEY:', process.env.REACT_APP_GOOGLE_MAPS_API_KEY ? 'SET' : 'NOT SET');
    console.log('- Current domain:', window.location.origin);
    console.log('- All env vars:', Object.keys(process.env).filter(key => key.startsWith('REACT_APP_')));

    const initializeMap = async () => {
      console.log('🗺️ initializeMap function called');
      console.log('- window.google available:', !!window.google);
      console.log('- mapRef.current available:', !!mapRef.current);
      
      // Initialize map creation function
      const createMap = (location, isUserLocation = false) => {
        if (!window.google || !mapRef.current) {
          console.warn('⚠️ Cannot create map - missing dependencies');
          return null;
        }

        try {
          console.log('🗺️ Creating Google Map with location:', location);
          const newMap = new window.google.maps.Map(mapRef.current, {
            center: location,
            zoom: 14,
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
              }
            ],
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true,
            gestureHandling: 'greedy' // Allows easier map movement
          });
          
          console.log('✅ Google Map created successfully');
          
          // Add user location marker if this is the user's actual location
          if (isUserLocation) {
            const userMarker = new window.google.maps.Marker({
              position: location,
              map: newMap,
              title: "Your Current Location",
              icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="14" cy="14" r="12" fill="#3B82F6" stroke="white" stroke-width="2"/>
                    <circle cx="14" cy="14" r="6" fill="white"/>
                    <circle cx="14" cy="14" r="3" fill="#3B82F6"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(28, 28),
                anchor: new window.google.maps.Point(14, 14)
              }
            });
            console.log('✅ User location marker added');
          }
          
          // Add map event listeners for interactive search
          newMap.addListener('click', (e) => {
            const clickedLocation = {
              lat: e.latLng.lat(),
              lng: e.latLng.lng()
            };
            console.log('🖱️ Map clicked at:', clickedLocation);
            setSearchLocation(clickedLocation);
          });

          // Add debounced listener for when map center changes (drag/pan)
          let centerChangeTimeout;
          newMap.addListener('center_changed', () => {
            clearTimeout(centerChangeTimeout);
            centerChangeTimeout = setTimeout(() => {
              const center = newMap.getCenter();
              if (center) {
                const newCenter = {
                  lat: center.lat(),
                  lng: center.lng()
                };
                // Update search location when map is moved (debounced)
                setSearchLocation(newCenter);
                console.log('🗺️ Map center changed to:', newCenter);
              }
            }, 500); // 500ms debounce
          });
          
          setMap(newMap);
          console.log('✅ Map state updated with interactive features');
          return newMap;
        } catch (error) {
          console.error('❌ Error creating Google Map:', error);
          return null;
        }
      };

      // Try multiple geolocation approaches for better success rate
      const tryGeolocation = async () => {
        console.log('🌍 Attempting automatic location detection...');
        
        // Check if geolocation is supported
        if (!navigator.geolocation) {
          console.log('❌ Geolocation not supported by this browser');
          throw new Error('Geolocation not supported');
        }

        // Check if we're in a secure context (HTTPS or localhost)
        const isSecureContext = window.isSecureContext || window.location.protocol === 'https:' || window.location.hostname === 'localhost';
        if (!isSecureContext) {
          console.log('⚠️ Geolocation requires HTTPS or localhost');
          throw new Error('Geolocation requires secure context');
        }
        
        // Method 1: Try high accuracy first
        const tryHighAccuracy = () => new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('High accuracy timeout'));
          }, 8000);
          
          navigator.geolocation.getCurrentPosition(
            (position) => {
              clearTimeout(timeoutId);
              resolve(position);
            },
            (error) => {
              clearTimeout(timeoutId);
              console.log('High accuracy error:', error.message);
              reject(error);
            },
            {
              enableHighAccuracy: true,
              timeout: 7000,
              maximumAge: 60000
            }
          );
        });
        
        // Method 2: Try with lower accuracy as fallback
        const tryLowAccuracy = () => new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
            reject(new Error('Low accuracy timeout'));
          }, 10000);
          
          navigator.geolocation.getCurrentPosition(
            (position) => {
              clearTimeout(timeoutId);
              resolve(position);
            },
            (error) => {
              clearTimeout(timeoutId);
              console.log('Low accuracy error:', error.message);
              reject(error);
            },
            {
              enableHighAccuracy: false,
              timeout: 9000,
              maximumAge: 300000
            }
          );
        });
        
        // Method 3: Try IP-based location as final fallback
        const tryIPLocation = async () => {
          try {
            console.log('🌐 Trying IP-based location...');
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            if (data.latitude && data.longitude) {
              console.log('✅ IP location found:', data.city, data.country);
              return {
                coords: {
                  latitude: data.latitude,
                  longitude: data.longitude,
                  accuracy: 10000 // Low accuracy for IP location
                }
              };
            }
            throw new Error('No location data from IP service');
          } catch (error) {
            console.log('❌ IP location failed:', error.message);
            throw error;
          }
        };

        // Try methods in sequence
        try {
          console.log('🎯 Trying high accuracy geolocation...');
          const position = await tryHighAccuracy();
          console.log('✅ High accuracy geolocation success!');
          return position;
        } catch (error1) {
          console.log('⚠️ High accuracy failed, trying low accuracy...');
          try {
            const position = await tryLowAccuracy();
            console.log('✅ Low accuracy geolocation success!');
            return position;
          } catch (error2) {
            console.log('⚠️ Low accuracy failed, trying IP location...');
            try {
              const position = await tryIPLocation();
              console.log('✅ IP location success!');
              return position;
            } catch (error3) {
              console.error('❌ All geolocation methods failed');
              console.log('Geolocation errors:', {
                highAccuracy: error1.message,
                lowAccuracy: error2.message,
                ipLocation: error3.message
              });
              throw new Error('All location detection methods failed');
            }
          }
        }
      };

      // Try to get location automatically
      try {
        const position = await tryGeolocation();
        console.log('✅ Location detected:', position.coords);
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setUserLocation(location);
        setSearchLocation(location);
        setLocationError(null);
        createMap(location, true);
        
      } catch (error) {
        console.log('🗽 Using default location, geolocation unavailable:', error.message);
        setLocationError(error.message);
        
        // Use default location (New York City) without showing error popup
        const defaultLocation = { lat: 40.7128, lng: -74.0060 };
        setUserLocation(null);
        setSearchLocation(defaultLocation);
        
        try {
          createMap(defaultLocation, false);
        } catch (mapError) {
          console.error('❌ Failed to create map with default location:', mapError);
          setMapError(mapError.message);
        }
      }
    };

    // Load Google Maps API if not already loaded
    if (!window.google) {
      console.log('📡 Google Maps not loaded, attempting to load script...');
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY?.trim();
      
      console.log('🔑 API Key check:');
      console.log('- Raw value:', apiKey);
      console.log('- Is set:', !!apiKey);
      console.log('- Length:', apiKey ? apiKey.length : 0);
      
      if (!apiKey) {
        console.error('❌ Google Maps API key is not set. Please add REACT_APP_GOOGLE_MAPS_API_KEY to your .env file');
        console.log('📝 Steps to fix:');
        console.log('1. Check your .env file in the BM/frontend/ directory');
        console.log('2. Make sure it contains: REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key');
        console.log('3. Restart your development server (npm start)');
        console.log('4. Make sure your API key has Maps JavaScript API and Places API enabled');
        return;
      }
      
      console.log('🚀 Loading Google Maps with API key:', apiKey.substring(0, 10) + '...');
      
      const script = document.createElement('script');
      const scriptUrl = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
      script.src = scriptUrl;
      script.async = true;
      script.defer = true;
      
      console.log('📡 Script URL:', scriptUrl);
      
      // Set up global callback
      window.initGoogleMaps = () => {
        console.log('✅ Google Maps script loaded successfully!');
        console.log('🌍 window.google available:', !!window.google);
        console.log('🗺️ google.maps available:', !!window.google?.maps);
        
        // Clean up the global callback
        delete window.initGoogleMaps;
        
        initializeMap().catch(error => {
          console.error('Map initialization error:', error);
          // Provide helpful error message for common domain restriction error
          if (error.message && error.message.includes('RefererNotAllowed')) {
            console.error('🚫 DOMAIN RESTRICTION ERROR:');
            console.log('Your Google Maps API key has domain restrictions.');
            console.log('To fix this:');
            console.log('1. Go to Google Cloud Console > APIs & Services > Credentials');
            console.log('2. Click on your API key');
            console.log('3. Under "Application restrictions", either:');
            console.log('   - Select "None" (less secure but works for development)');
            console.log('   - Add your current domain:', window.location.origin);
            console.log('   - Add common development domains: http://localhost:3000, http://localhost:3001');
            console.log('4. Save changes and wait a few minutes for them to take effect');
          }
        });
      };
      
      script.onerror = (error) => {
        console.error('❌ Failed to load Google Maps script:', error);
        console.log('🔧 Troubleshooting steps:');
        console.log('1. Check your API key is correct');
        console.log('2. Make sure these APIs are enabled in Google Cloud Console:');
        console.log('   - Maps JavaScript API');
        console.log('   - Places API');
        console.log('3. Check API key restrictions:');
        console.log('   - Current domain:', window.location.origin);
        console.log('   - Make sure this domain is allowed in your API key settings');
        console.log('4. Verify billing is enabled for your Google Cloud project');
        console.log('5. Check browser console for CORS or network errors');
        
        // Clean up the global callback on error
        delete window.initGoogleMaps;
      };
      
      console.log('📤 Adding script to document head...');
      document.head.appendChild(script);
      
      // Also add a timeout to detect if script never loads
      setTimeout(() => {
        if (!window.google && window.initGoogleMaps) {
          console.error('⏰ Google Maps script failed to load within 15 seconds');
          console.log('🔍 Check Network tab in DevTools for script loading errors');
          console.log('💡 Common causes:');
          console.log('- API key domain restrictions');
          console.log('- Network connectivity issues');
          console.log('- API quota exceeded');
          console.log('- Billing not enabled');
          
          // Clean up the global callback on timeout
          delete window.initGoogleMaps;
        }
      }, 15000);
      
    } else {
      console.log('✅ Google Maps already loaded, initializing map...');
      initializeMap().catch(error => console.error('Map initialization error:', error));
    }
  }, []);

  // Clear existing markers
  const clearMapMarkers = () => {
    if (window.businessMarkers) {
      window.businessMarkers.forEach(marker => marker.setMap(null));
      window.businessMarkers = [];
    }
  };

  // Get marker color based on health score
  const getMarkerColor = (score) => {
    if (score >= 80) return '#22c55e'; // Green - Excellent
    if (score >= 60) return '#3b82f6'; // Blue - Good
    if (score >= 40) return '#f59e0b'; // Orange - Fair
    return '#ef4444'; // Red - Poor
  };

  // Create colored marker icon
  const createMarkerIcon = (score) => {
    const color = getMarkerColor(score);
    return {
      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
        <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16C0 28 16 40 16 40C16 40 32 28 32 16C32 7.163 24.837 0 16 0Z" fill="${color}"/>
          <circle cx="16" cy="16" r="10" fill="white"/>
          <text x="16" y="20" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="${color}">${score}</text>
        </svg>
      `),
      scaledSize: new window.google.maps.Size(32, 40),
      anchor: new window.google.maps.Point(16, 40)
    };
  };

  // Add business markers to map
  const addBusinessMarkers = (businesses) => {
    if (!map || !businesses.length) return;
    
    clearMapMarkers();
    window.businessMarkers = [];

    businesses.forEach(business => {
      const marker = new window.google.maps.Marker({
        position: business.location,
        map: map,
        title: `${business.name} (Score: ${business.digitalScore})`,
        icon: createMarkerIcon(business.digitalScore)
      });

      // Add click listener to show business info
      marker.addListener('click', () => {
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 250px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${business.name}</h3>
              <p style="margin: 4px 0; color: #666; font-size: 14px;">${business.address || 'Address not available'}</p>
              <div style="margin: 8px 0; display: flex; align-items: center; gap: 8px;">
                <span style="background: ${getMarkerColor(business.digitalScore)}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                  Health Score: ${business.digitalScore}
                </span>
                ${business.rating ? `<span style="color: #f59e0b;">⭐ ${business.rating}</span>` : ''}
              </div>
              ${business.website ? `<a href="${business.website}" target="_blank" style="color: #3b82f6; text-decoration: none; font-size: 14px;">🌐 Visit Website</a>` : ''}
            </div>
          `
        });
        infoWindow.open(map, marker);
      });

      window.businessMarkers.push(marker);
    });

    console.log(`📍 Added ${businesses.length} colored markers to map`);
  };

  // Search for businesses
  const searchBusinesses = async () => {
    if (!map || !searchLocation) return;

    console.log('🔍 Starting business search...');
    setLoading(true);
    try {
      const service = new window.google.maps.places.PlacesService(map);
      // Handle multiple business types or show all if none selected
      const typesToSearch = selectedBusinessTypes.length > 0 
        ? selectedBusinessTypes.filter(type => type !== 'custom')
        : ['establishment'];

      // Add custom type if specified
      if (selectedBusinessTypes.includes('custom') && customBusinessType.trim()) {
        typesToSearch.push(customBusinessType.trim());
      }

      console.log('🎯 Searching for types:', typesToSearch);
      let allResults = [];

      // Search for each business type
      const searchPromises = typesToSearch.map(businessType => 
        new Promise((resolve) => {
          const request = {
            location: searchLocation,
            radius: 5000, // 5km radius
            type: businessType === 'startup' ? 'establishment' : businessType,
            keyword: businessType === 'startup' ? 'startup tech company' : businessType
          };

          service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              console.log(`✅ Found ${results.length} results for ${businessType}`);
              resolve(results || []);
            } else {
              console.log(`⚠️ No results for ${businessType}:`, status);
              resolve([]);
            }
          });
        })
      );

      // Wait for all searches to complete
      const searchResults = await Promise.all(searchPromises);
      
      // Combine and deduplicate results
      const combinedResults = searchResults.flat();
      const uniqueResults = combinedResults.filter((place, index, self) => 
        index === self.findIndex(p => p.place_id === place.place_id)
      );

      console.log(`📊 Total unique results: ${uniqueResults.length}`);

      // Take up to maxResults
      const limitedResults = uniqueResults.slice(0, maxResults);
      
      let processedBusinesses = limitedResults.map(place => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        rating: place.rating,
        photos: place.photos ? [place.photos[0].getUrl({ maxWidth: 400, maxHeight: 300 })] : [],
        phone: null, // Will be filled by detailed search
        website: null, // Will be filled by detailed search
        location: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      }));

      console.log('🏢 Processing', processedBusinesses.length, 'businesses...');

          // Get detailed information for each business
          const detailPromises = processedBusinesses.map(business => 
            new Promise(resolve => {
              service.getDetails({
                placeId: business.id,
                fields: ['formatted_phone_number', 'website', 'url']
              }, (details, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                  resolve({
                    ...business,
                    phone: details.formatted_phone_number,
                    website: details.website
                  });
                } else {
                  resolve(business);
                }
              });
            })
          );

          Promise.all(detailPromises).then(detailedBusinesses => {
            // Calculate digital health scores
            const businessesWithScores = detailedBusinesses.map(business => ({
              ...business,
              digitalScore: calculateDigitalHealthScore(business)
            }));
            
            // Apply filters
            let filteredBusinesses = businessesWithScores;
            if (filters.hasWebsite) {
              filteredBusinesses = filteredBusinesses.filter(b => b.website);
            }
            if (filters.hasPhone) {
              filteredBusinesses = filteredBusinesses.filter(b => b.phone);
            }
            if (filters.hasAddress) {
              filteredBusinesses = filteredBusinesses.filter(b => b.address);
            }

            console.log('✅ Search completed successfully with', filteredBusinesses.length, 'businesses');
            setBusinesses(filteredBusinesses);
            
            // Add colorful markers to map
            addBusinessMarkers(filteredBusinesses);
            
            setLoading(false);
          });
    } catch (error) {
      console.error('Error searching businesses:', error);
      setLoading(false);
    }
  };

  // Handle business detail view
  const handleViewDetails = (business) => {
    // TODO: Open detailed business view modal or navigate to detail page
    console.log('View details for:', business);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      {/* Header */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile hamburger menu */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden hamburger-btn p-2 -ml-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showMobileMenu ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
              
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                ClientAIMap
              </h1>
              <div className="hidden md:flex items-center space-x-2 text-sm text-neutral-500">
                <span>•</span>
                <span>Freelancer Dashboard</span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeView === 'dashboard' 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                Dashboard
              </button>
              
              <button
                onClick={() => setActiveView('saved')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center space-x-1 ${
                  activeView === 'saved' 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                <span>Saved Leads</span>
                {!loadingSavedBusinesses && savedBusinesses.length > 0 && (
                  <span className="bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {savedBusinesses.length}
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveView('profile')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeView === 'profile' 
                    ? 'text-primary-600 bg-primary-50' 
                    : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                Profile
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {(userData?.name || userData?.user?.user_metadata?.name || userData?.user?.email)?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-neutral-700">
                  {userData?.name || userData?.user?.user_metadata?.name || userData?.user?.email || 'User'}
                </span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-all duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
            
            {/* Mobile Profile */}
            <div className="md:hidden relative">
              <button
                onClick={toggleProfileDropdown}
                className="profile-btn w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg"
              >
                {(userData?.name || userData?.user?.user_metadata?.name || userData?.user?.email)?.charAt(0)?.toUpperCase() || 'U'}
              </button>
              
              {/* Mobile Profile Dropdown */}
              {showProfileDropdown && (
                <div className="profile-dropdown absolute right-0 top-12 w-48 bg-white rounded-2xl border border-neutral-200 shadow-xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="text-sm font-medium text-neutral-800 truncate">
                      {userData?.name || userData?.user?.user_metadata?.name || userData?.user?.email || 'User'}
                    </p>
                  </div>
                  <button
                    onClick={onLogout}
                    className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Sidebar */}
        {showMobileMenu && (
          <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={closeMobileMenu}></div>
            
            {/* Sidebar */}
            <div className="mobile-menu fixed left-0 top-0 h-full w-80 bg-white border-r border-neutral-200 z-50 md:hidden transform transition-transform duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                    Menu
                  </h2>
                  <button
                    onClick={closeMobileMenu}
                    className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      setActiveView('dashboard');
                      closeMobileMenu();
                    }}
                    className={`w-full px-4 py-3 text-left rounded-xl transition-colors ${
                      activeView === 'dashboard' 
                        ? 'bg-primary-50 text-primary-600 font-medium' 
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    📊 Dashboard
                  </button>
                  
                  <button
                    onClick={() => {
                      setActiveView('saved');
                      closeMobileMenu();
                    }}
                    className={`w-full px-4 py-3 text-left rounded-xl transition-colors flex items-center justify-between ${
                      activeView === 'saved' 
                        ? 'bg-primary-50 text-primary-600 font-medium' 
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <span>🔖 Saved Leads</span>
                    {!loadingSavedBusinesses && savedBusinesses.length > 0 && (
                      <span className="bg-primary-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                        {savedBusinesses.length}
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      setActiveView('profile');
                      closeMobileMenu();
                    }}
                    className={`w-full px-4 py-3 text-left rounded-xl transition-colors ${
                      activeView === 'profile' 
                        ? 'bg-primary-50 text-primary-600 font-medium' 
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    👤 Profile
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeView === 'dashboard' ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Search & Filters */}
            <div className="lg:col-span-1 space-y-6">
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 text-white">
                <h2 className="text-xl font-bold mb-2">
                  Welcome back, {userData?.name || userData?.user?.user_metadata?.name?.split(' ')[0] || 'there'}!
                </h2>
                <p className="text-primary-100">
                  Discover opportunities in your area and connect with businesses that need your skills.
                </p>
                
                {/* Domain Restriction Help */}
                {mapError && mapError.includes('RefererNotAllowed') && (
                  <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-lg">
                    <p className="text-sm font-medium text-white mb-2">🔧 Map Configuration Issue</p>
                    <div className="text-xs text-primary-100 space-y-1">
                      <p>• Go to Google Cloud Console → APIs & Services → Credentials</p>
                      <p>• Click your API key → Application restrictions</p>
                      <p>• Add domain: <span className="font-mono bg-white/20 px-1 rounded">{window.location.origin}</span></p>
                      <p>• Or set to "None" for development</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Search Controls */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <h3 className="font-bold text-lg text-neutral-800 mb-4">Search Businesses</h3>
                
                {/* Business Type Selection */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-neutral-700">
                      Business Types ({selectedBusinessTypes.length} selected)
                    </label>
                    {selectedBusinessTypes.length > 0 && (
                      <button
                        onClick={clearBusinessTypes}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mb-3">
                    Select multiple types or none to show all businesses
                  </p>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {BUSINESS_TYPES.slice(0, -1).map(type => (
                      <button
                        key={type.id}
                        onClick={() => toggleBusinessType(type.id)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                          selectedBusinessTypes.includes(type.id)
                            ? 'border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-200'
                            : 'border-neutral-200 hover:border-primary-300 text-neutral-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg mb-1">{type.icon}</div>
                            {type.label}
                          </div>
                          {selectedBusinessTypes.includes(type.id) && (
                            <div className="text-primary-500 text-sm">✓</div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Custom Business Type */}
                  <button
                    onClick={() => toggleBusinessType('custom')}
                    className={`w-full p-3 rounded-xl border text-sm font-medium transition-all duration-200 mb-3 ${
                      selectedBusinessTypes.includes('custom')
                        ? 'border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-200'
                        : 'border-neutral-200 hover:border-primary-300 text-neutral-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg mb-1">✏️</div>
                        Custom
                      </div>
                      {selectedBusinessTypes.includes('custom') && (
                        <div className="text-primary-500 text-sm">✓</div>
                      )}
                    </div>
                  </button>
                  
                  {selectedBusinessTypes.includes('custom') && (
                    <input
                      type="text"
                      value={customBusinessType}
                      onChange={(e) => setCustomBusinessType(e.target.value)}
                      placeholder="Enter business type..."
                      className="w-full mt-3 p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  )}
                </div>

                {/* Max Results */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Max Results
                  </label>
                  <select
                    value={maxResults}
                    onChange={(e) => setMaxResults(Number(e.target.value))}
                    className="w-full p-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value={50}>50 results</option>
                    <option value={75}>75 results</option>
                    <option value={100}>100 results</option>
                  </select>
                </div>

                {/* Search Button */}
                <button
                  onClick={searchBusinesses}
                  disabled={loading || !searchLocation}
                  className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg"
                >
                  {loading ? 'Searching...' : 'Search Businesses'}
                </button>
              </div>

              {/* Filters */}
              <SearchFilters filters={filters} onFiltersChange={setFilters} />
            </div>

            {/* Right Content - Map & Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Map */}
              <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
                <div className="p-4 border-b border-neutral-200">
                  <h3 className="font-bold text-lg text-neutral-800">Search Area</h3>
                  <p className="text-sm text-neutral-500">Click anywhere on the map to change your search location</p>
                  
                  {/* Map Error Notification */}
                  {mapError && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <div className="text-red-500 text-sm mt-0.5">⚠️</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-800">Map Loading Error</p>
                          <p className="text-xs text-red-600 mt-1">
                            {mapError.includes('RefererNotAllowed') || mapError.includes('domain') 
                              ? 'Your Google Maps API key has domain restrictions. Please check the console for instructions on how to fix this.'
                              : mapError
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Location Error Notification */}
                  {locationError && !mapError && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <div className="text-yellow-500 text-sm mt-0.5">📍</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-yellow-800">Location Detection Unavailable</p>
                          <p className="text-xs text-yellow-600 mt-1">
                            Using default location (New York). You can click on the map to set your preferred search area.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Map Container */}
                <div className="relative">
                  <div ref={mapRef} className="w-full h-96"></div>
                  
                  {/* Map Overlay for when Google Maps fails to load */}
                  {mapError && (
                    <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
                      <div className="text-center p-6">
                        <div className="text-4xl mb-3 opacity-50">🗺️</div>
                        <h4 className="text-lg font-semibold text-neutral-800 mb-2">Map Unavailable</h4>
                        <p className="text-sm text-neutral-600 mb-3">
                          There's an issue with the Google Maps configuration.
                        </p>
                        <p className="text-xs text-neutral-500">
                          Check the browser console for detailed troubleshooting steps.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Results */}
              <div className="bg-white rounded-2xl border border-neutral-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-neutral-800">
                    Business Results ({businesses.length})
                  </h3>
                  {businesses.length > 0 && (
                    <div className="text-sm text-neutral-500">
                      Showing {businesses.length} of {maxResults} results
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
                    <span className="ml-3 text-neutral-600">Searching businesses...</span>
                  </div>
                ) : businesses.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {businesses.map(business => (
                      <BusinessCard
                        key={business.id}
                        business={business}
                        onViewDetails={handleViewDetails}
                        onSave={toggleSaveBusiness}
                        onSocialSearch={searchSocialMedia}
                        isSaved={isBusinessSaved(business.id)}
                        isSaving={savingBusiness === business.id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4 opacity-50">🔍</div>
                    <h4 className="text-lg font-semibold text-neutral-800 mb-2">No businesses found</h4>
                    <p className="text-neutral-500">
                      Try adjusting your search criteria or selecting a different area on the map.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeView === 'profile' ? (
          /* Profile View */
          <div className="">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-neutral-800 mb-2">Profile</h2>
              <p className="text-neutral-600">Manage your profile information and settings</p>
            </div>
            
            <ProfileSection userData={userData} />
          </div>
        ) : (
          /* Saved Businesses View */
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-neutral-800 mb-2">Saved Leads</h2>
              <p className="text-neutral-600">Businesses you've bookmarked for follow-up opportunities</p>
            </div>
            
            {savedBusinesses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedBusinesses.map(business => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    onViewDetails={handleViewDetails}
                    onSave={toggleSaveBusiness}
                    onSocialSearch={searchSocialMedia}
                    isSaved={true}
                    isSaving={savingBusiness === business.id}
                  />
                ))}
              </div>
            ) : loadingSavedBusinesses ? (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                <div className="flex items-center justify-center space-x-3">
                  <div className="animate-spin w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full"></div>
                  <span className="text-neutral-600">Loading saved businesses...</span>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-neutral-200 p-12 text-center">
                <div className="text-6xl mb-4 opacity-50">🔖</div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-2">No saved leads yet</h3>
                <p className="text-neutral-500 mb-6">
                  Start exploring businesses and save the ones that interest you for future opportunities.
                </p>
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-accent-600 transition-all duration-300 hover:shadow-lg"
                >
                  Explore Businesses
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FreelancerDashboard;
