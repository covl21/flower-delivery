import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

interface MapProps {
  shopLocation: { lat: number; lng: number };
  userAddress: string;
  setUserLocation: (loc: { lat: number; lng: number }) => void;
  setUserAddress: (address: string) => void;
  setDeliveryTime?: (time: string | null) => void;
}

const LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];

const Map: React.FC<MapProps> = ({
  shopLocation,
  userAddress,
  setUserLocation,
  setUserAddress,
  setDeliveryTime,
}) => {
  const [userMarker, setUserMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [directions, setDirections] = useState<any>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  useEffect(() => {
    if (!userAddress) return;

    geocodeByAddress(userAddress)
      .then(results => results[0] ? getLatLng(results[0]) : null)
      .then(pos => {
        if (pos) {
          setUserMarker(pos);
          setUserLocation(pos);
          mapRef.current?.panTo(pos);
          setDirections(null);
        }
      })
      .catch(console.error);
  }, [userAddress, setUserLocation, setDeliveryTime]);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setUserMarker(pos);
    setUserLocation(pos);
    setDirections(null);

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: pos }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        setUserAddress(results[0].formatted_address);
      }
    });
  }, [setUserLocation, setUserAddress]);

  const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
    const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setUserMarker(pos);
    setUserLocation(pos);
    setDirections(null);

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: pos }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        setUserAddress(results[0].formatted_address);
      }
    });
  }, [setUserLocation, setUserAddress]);

  const resetMap = () => {
    if (mapRef.current) {
      mapRef.current.panTo(shopLocation);
      mapRef.current.setZoom(12);
      setUserMarker(null);
      setDirections(null);
      setDeliveryTime?.(null);
    }
  };

  if (loadError) return <div>Error loading Google Maps</div>;
  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div style={{ position: "relative" }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={userMarker || shopLocation}
        zoom={12}
        onClick={handleMapClick}
        onLoad={(map) => { mapRef.current = map; }}
      >
        <Marker position={shopLocation} label="Shop" />
        {userMarker && (
          <Marker
            position={userMarker}
            label="You"
            draggable
            onDragEnd={handleMarkerDragEnd}
          />
        )}

        {userMarker && !directions && (
          <DirectionsService
            options={{
              origin: shopLocation,
              destination: userMarker,
              travelMode: google.maps.TravelMode.DRIVING,
            }}
            callback={(result, status) => {
              if (status === "OK" && result) {
                setDirections(result);
                const time = result.routes[0]?.legs[0]?.duration?.text || null;
                setDeliveryTime?.(time);
              }
            }}
          />
        )}

        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      <button
        onClick={resetMap}
        style={{
          position: "absolute",
          top: 340,
          left: 10,
          zIndex: 10,
          padding: "8px 12px",
          borderRadius: "5px",
          border: "none",
          background: "#1976d2",
          color: "white",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
        }}
      >
        Reset Map
      </button>
    </div>
  );
};

export default Map;
