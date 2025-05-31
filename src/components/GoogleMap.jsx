import React, { useEffect, useRef, useState } from 'react';

const GoogleMap = ({ 
  onLocationSelect, 
  initialLocation = { lat: 14.5995, lng: 120.9842 }, // Manila center
  height = '400px',
  markers = []
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (!window.google) {
      console.error('Google Maps API not loaded');
      return;
    }

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: initialLocation,
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });

    setMap(mapInstance);

    // Add click listener for location selection
    if (onLocationSelect) {
      mapInstance.addListener('click', (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        
        setSelectedLocation({ lat, lng });
        
        // Reverse geocoding to get address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            const address = results[0].formatted_address;
            
            // Extract barangay from address components
            let barangay = 'Unknown';
            for (const component of results[0].address_components) {
              if (component.types.includes('sublocality_level_1') || 
                  component.types.includes('political')) {
                barangay = component.long_name;
                break;
              }
            }
            
            onLocationSelect({
              latitude: lat,
              longitude: lng,
              address,
              barangay
            });
          }
        });
      });
    }

    return () => {
      // Cleanup
    };
  }, [initialLocation, onLocationSelect]);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    // Add new markers
    markers.forEach(marker => {
      new window.google.maps.Marker({
        position: { lat: marker.latitude, lng: marker.longitude },
        map: map,
        title: marker.title,
        icon: marker.icon || undefined
      });
    });

    // Add selected location marker
    if (selectedLocation) {
      new window.google.maps.Marker({
        position: selectedLocation,
        map: map,
        title: 'Selected Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#dc2626"/>
              <circle cx="12" cy="9" r="2.5" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24),
        }
      });
    }
  }, [map, markers, selectedLocation]);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%' }}
      className="rounded-lg border border-gray-300"
    />
  );
};

export default GoogleMap;