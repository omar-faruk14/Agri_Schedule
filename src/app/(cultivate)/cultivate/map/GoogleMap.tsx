import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./MarkerStyles.module.css";

type MarkerData = {
  id: number;
  lat: number;
  lon: number;
  status: "start" | "middle" | "complete";
};

type GoogleMapProps = {
  center: [number, number]; // [latitude, longitude]
  zoom: number;
};

const GoogleMap: React.FC<GoogleMapProps> = ({ center, zoom }) => {
  const mapRef = useRef<HTMLDivElement | null>(null); // Reference to map container
  const [isClient, setIsClient] = useState(false);

  // Dummy data representing work progress stages
  const markerData: MarkerData[] = [
    { id: 1, lat: 36.66498, lon: 138.180204, status: "start" },
    { id: 2, lat: 36.66503, lon: 138.180252, status: "complete" },
    { id: 3, lat: 36.665068, lon: 138.180281, status: "complete" },
    { id: 4, lat: 36.664902, lon: 138.180304, status: "complete" },
    { id: 5, lat: 36.665013, lon: 138.180385, status: "middle" },
  ];

  // Set isClient to true after the component mounts (only on the client)
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && mapRef.current) {
      // Initialize the Leaflet map
      const map = L.map(mapRef.current).setView(center, zoom);

      // OpenStreetMap tile layer URL (using a more commonly available source)
      const tileLayerUrl = "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}";

      // Add the OpenStreetMap tile layer
      L.tileLayer(tileLayerUrl, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 23,
      }).addTo(map);

      // Loop through dummy data and add markers
      markerData.forEach((data) => {
        const markerIcon = L.divIcon({
          className: `${styles.marker} ${styles[data.status]}`, // Apply correct class for status
          iconSize: [15, 15], // Fixed small size for the custom marker icon
          iconAnchor: [7.5, 7.5], // Anchor the icon in the center
        });

        L.marker([data.lat, data.lon], { icon: markerIcon })
          .addTo(map)
          .bindPopup(
            `Work ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`
          );
      });

      // Clean up the map instance when the component unmounts
      return () => {
        map.remove();
      };
    }
  }, [isClient, center, zoom]);

  return <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default GoogleMap;
