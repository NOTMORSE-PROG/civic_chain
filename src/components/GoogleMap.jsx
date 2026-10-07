"use client"

// Replace the entire GoogleMap component with this simplified version that fixes the IntersectionObserver error
import { useEffect, useRef, useState } from "react"
import { MapPin, Loader2, AlertCircle } from "lucide-react"

const GoogleMap = ({
  onLocationSelect,
  initialLocation = { lat: 14.5995, lng: 120.9842 }, // Manila center
  height = "400px",
  markers = [],
  showAddressCard = true,
}) => {
  const mapRef = useRef(null)
  const [map, setMap] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [geocoding, setGeocoding] = useState(false)

  useEffect(() => {
    // Simple script loading without IntersectionObserver
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initializeMap()
        return
      }

      // Check if script is already loading
      const existingScript = document.querySelector('script[src*="maps.googleapis.com"]')
      if (existingScript) {
        const checkGoogle = setInterval(() => {
          if (window.google && window.google.maps) {
            clearInterval(checkGoogle)
            initializeMap()
          }
        }, 100)
        return
      }

      // Load Google Maps script from environment configuration
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      if (!apiKey) {
        setError("Google Maps is not configured.")
        setLoading(false)
        return
      }

      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initializeMap
      script.onerror = () => {
        setError("Failed to load Google Maps. Please check your internet connection.")
        setLoading(false)
      }
      document.head.appendChild(script)
    }

    const initializeMap = () => {
      try {
        if (!mapRef.current) {
          setLoading(false)
          return
        }

        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: initialLocation,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControl: true,
        })

        setMap(mapInstance)
        setLoading(false)

        // Add click listener for location selection
        if (onLocationSelect) {
          mapInstance.addListener("click", async (event) => {
            const lat = event.latLng.lat()
            const lng = event.latLng.lng()

            setSelectedLocation({ lat, lng })
            setGeocoding(true)

            try {
              const geocoder = new window.google.maps.Geocoder()
              geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === "OK" && results[0]) {
                  const result = results[0]
                  const address = result.formatted_address

                  // Extract location components
                  let barangay = "Unknown"
                  let city = "Manila"

                  for (const component of result.address_components) {
                    const types = component.types
                    if (types.includes("sublocality_level_1") || types.includes("political")) {
                      barangay = component.long_name
                    }
                    if (types.includes("locality")) {
                      city = component.long_name
                    }
                  }

                  const locationData = {
                    latitude: lat,
                    longitude: lng,
                    address,
                    barangay,
                    city,
                  }

                  setSelectedAddress(locationData)
                  onLocationSelect(locationData)
                  setGeocoding(false)
                } else {
                  const fallbackData = {
                    latitude: lat,
                    longitude: lng,
                    address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                    barangay: "Unknown",
                    city: "Manila",
                  }
                  setSelectedAddress(fallbackData)
                  onLocationSelect(fallbackData)
                  setGeocoding(false)
                }
              })
            } catch (error) {
              console.error("Geocoding error:", error)
              const fallbackData = {
                latitude: lat,
                longitude: lng,
                address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
                barangay: "Unknown",
                city: "Manila",
              }
              setSelectedAddress(fallbackData)
              onLocationSelect(fallbackData)
              setGeocoding(false)
            }
          })
        }
      } catch (err) {
        console.error("Map initialization error:", err)
        setError("Failed to initialize map. Please refresh the page.")
        setLoading(false)
      }
    }

    loadGoogleMaps()

    return () => {
      // Cleanup if needed
    }
  }, [initialLocation, onLocationSelect])

  useEffect(() => {
    if (!map || !window.google) return

    // Clear existing markers
    // Add new markers
    markers.forEach((marker) => {
      new window.google.maps.Marker({
        position: { lat: marker.latitude, lng: marker.longitude },
        map: map,
        title: marker.title,
      })
    })

    // Add selected location marker
    if (selectedLocation) {
      new window.google.maps.Marker({
        position: selectedLocation,
        map: map,
        title: "Selected Location",
      })
    }
  }, [map, markers, selectedLocation])

  if (error) {
    return (
      <div
        style={{ height }}
        className="w-full bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center"
      >
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Map Error</h3>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        {loading && (
          <div
            style={{ height }}
            className="w-full bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center"
          >
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading Google Maps...</p>
            </div>
          </div>
        )}

        <div
          ref={mapRef}
          style={{ height, display: loading ? "none" : "block" }}
          className="w-full rounded-lg border border-gray-300 shadow-sm"
        />

        {/* Map Controls */}
        {!loading && geocoding && (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
            <span className="text-sm text-gray-700">Getting address...</span>
          </div>
        )}
      </div>

      {/* Selected Address Card */}
      {selectedAddress && showAddressCard && (
        <div className="bg-white border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-green-900 mb-1">📍 Location Selected</h4>
              <p className="text-sm text-green-800 mb-3 break-words leading-relaxed">{selectedAddress.address}</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-green-50 rounded-md p-2">
                  <span className="text-green-700 font-medium block">Barangay:</span>
                  <span className="text-green-600">{selectedAddress.barangay}</span>
                </div>
                <div className="bg-green-50 rounded-md p-2">
                  <span className="text-green-700 font-medium block">City:</span>
                  <span className="text-green-600">{selectedAddress.city}</span>
                </div>
                <div className="col-span-2 bg-green-50 rounded-md p-2">
                  <span className="text-green-700 font-medium block">Coordinates:</span>
                  <span className="text-green-600 font-mono text-xs">
                    {selectedAddress.latitude.toFixed(6)}, {selectedAddress.longitude.toFixed(6)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GoogleMap
