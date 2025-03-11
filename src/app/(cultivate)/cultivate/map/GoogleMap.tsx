import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./MarkerStyles.module.css";
import RBush from "rbush";

// Define Marker Data
interface MarkerData {
  id: number;
  lat: number;
  lon: number;
  status: "start" | "middle" | "complete";
}

// Define Props
interface GoogleMapProps {
  center: [number, number];
  zoom: number;
}

// Define GeoJSON Feature
/* eslint-disable @typescript-eslint/no-explicit-any */
interface GeoJSONFeature {
  geometry: {
    type: string;
    coordinates: any;
  };
  properties: {
    icon: string;
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */


// Define Spatial Index Data
interface SpatialIndexData {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  data: {
    icon: string;
    bounds: L.LatLngBounds;
  };
}

const GoogleMap: React.FC<GoogleMapProps> = ({ center, zoom }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const overlayGroupRef = useRef(L.layerGroup());
  const overlayLayers = useRef(new Map<string, L.Layer>());
  const spatialIndex = useRef(new RBush<SpatialIndexData>());
  const [isClient, setIsClient] = useState(false);

  const markerData: MarkerData[] = [
    { id: 1, lat: 36.66498, lon: 138.180204, status: "start" },
    { id: 2, lat: 36.66503, lon: 138.180252, status: "complete" },
    { id: 3, lat: 36.665068, lon: 138.180281, status: "complete" },
    { id: 4, lat: 36.664902, lon: 138.180304, status: "complete" },
    { id: 5, lat: 36.665013, lon: 138.180385, status: "middle" },
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: false,
      scrollWheelZoom: true,
      doubleClickZoom: false,
      touchZoom: false,
      dragging: true,
    });

    L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 20,
    }).addTo(map);

    overlayGroupRef.current.addTo(map);

    // Load GeoJSON Overlays
    const fetchGeoJSONData = async (): Promise<{
      features: GeoJSONFeature[];
    } | null> => {
      try {
        const response = await fetch("/kml_2 - Copy/doc.geojson");
        if (!response.ok)
          throw new Error(`Error fetching GeoJSON: ${response.statusText}`);
        return response.json();
      } catch (error) {
        console.error("Error loading GeoJSON data:", error);
        return null;
      }
    };

    const parseGeoJSONOverlays = (geojson: { features: GeoJSONFeature[] }) => {
      const parsedFeatures: SpatialIndexData[] = geojson.features.map(
        (feature) => {
          const bounds =
            feature.geometry.type === "Polygon"
              ? L.latLngBounds(
                  feature.geometry.coordinates[0].map(
                    ([lng, lat]: [number, number]) => [lat, lng]
                  )
                )
              : L.latLngBounds([
                  [
                    feature.geometry.coordinates[1],
                    feature.geometry.coordinates[0],
                  ],
                ]);

          return {
            minX: bounds.getWest(),
            minY: bounds.getSouth(),
            maxX: bounds.getEast(),
            maxY: bounds.getNorth(),
            data: { icon: feature.properties.icon, bounds },
          };
        }
      );
      spatialIndex.current.load(parsedFeatures);
    };

    const loadVisibleOverlays = () => {
      const bounds = map.getBounds();
      const visibleFeatures = spatialIndex.current.search({
        minX: bounds.getWest(),
        minY: bounds.getSouth(),
        maxX: bounds.getEast(),
        maxY: bounds.getNorth(),
      });

      visibleFeatures.forEach(({ data }) => {
        const { icon, bounds: overlayBounds } = data;
        if (!overlayLayers.current.has(icon)) {
          const imagePath = `/kml_2 - Copy/${icon}`;
          const overlayLayer = L.imageOverlay(imagePath, overlayBounds, {
            opacity: 1.0,
          });
          overlayLayers.current.set(icon, overlayLayer);
          overlayGroupRef.current.addLayer(overlayLayer);
        }
      });
    };

    const clearInvisibleOverlays = () => {
      const bounds = map.getBounds();
      overlayLayers.current.forEach((layer, icon) => {
        const imageOverlayLayer = layer as L.ImageOverlay;
        if (!bounds.intersects(imageOverlayLayer.getBounds())) {
          overlayGroupRef.current.removeLayer(layer);
          overlayLayers.current.delete(icon);
        }
      });
    };


    fetchGeoJSONData().then((geojson) => {
      if (geojson) {
        parseGeoJSONOverlays(geojson);
        loadVisibleOverlays();
      }
    });

    map.on("moveend", () => {
      clearInvisibleOverlays();
      loadVisibleOverlays();
    });
    
    // Add Markers
    markerData.forEach((data: MarkerData) => {
      // Explicitly define the type here
      const markerIcon = L.divIcon({
        className: `${styles.marker} ${styles[data.status]}`,
        iconSize: [15, 15],
        iconAnchor: [7.5, 7.5],
      });

      L.marker([data.lat, data.lon], { icon: markerIcon })
        .addTo(map)
        .bindPopup(
          `Work ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`
        );
    });

    return () => {
      map.remove();
    };
  }, [isClient, center, zoom]);

  return <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />;
};

export default GoogleMap;
