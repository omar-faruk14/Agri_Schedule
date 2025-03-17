import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./MarkerStyles.module.css";
import RBush from "rbush";
import styles2 from "./styles2.module.css";
import Link from "next/link";
import Legend from "./legend";


// Define Marker Data
interface MarkerData {
  id: number;
  lat: number;
  lon: number;
  task: string;
  status: "スタート" | "途中" | "完了";
}

// Define Props
interface GoogleMapProps 
{
  center: [number, number];
  zoom: number;
}

interface ApiResponseItem {
  latitude: string;
  longitude: string;
  Record_number: string;
  task: string;
  status: string;
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
  const [markerData, setMarkerData] = useState<MarkerData[]>([]);
  const [selectedTask, setSelectedTask] = useState("");

  // Fetch Data from API
  useEffect(() => {
    const fetchMarkerData = async () => {
      if (!selectedTask) return; // 🚨 Prevent API call when selectedTask is empty

      try {
        const response = await fetch(
          `/api/map?task=${selectedTask}`
        );
        if (!response.ok) throw new Error("Failed to fetch marker data");

        const data = await response.json();

        // Convert API response to match MarkerData structure with validation
        const formattedData: MarkerData[] = (data as ApiResponseItem[])
          .map((item) => {
            const lat = parseFloat(item.latitude as string);
            const lon = parseFloat(item.longitude as string);

            if (isNaN(lat) || isNaN(lon)) {
              console.warn(`Skipping invalid marker: ${JSON.stringify(item)}`);
              return null;
            }

            return {
              id: parseInt(item.Record_number as string, 10),
              lat,
              lon,
              task: item.task as string,
              status: item.status as "スタート" | "途中" | "完了",
            };
          })
          .filter((item): item is MarkerData => item !== null);

        setMarkerData(formattedData);
      } catch (error) {
        console.error("Error fetching marker data:", error);
      }
    };

    fetchMarkerData();
  }, [selectedTask]); // ✅ API only calls when `selectedTask` changes

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
        iconSize: [10, 10],
        iconAnchor: [7.5, 7.5],
      });

      L.marker([data.lat, data.lon], { icon: markerIcon })
        .addTo(map)
        .bindPopup(
          `作業 ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`
        );
    });

    return () => {
      map.remove();
    };
  }, [isClient, center, zoom, markerData]);

  return (
    <div className={styles2.mapContainer}>
      {/* Task Selector Dropdown */}
      <select
        className={styles2.selectTask}
        value={selectedTask}
        onChange={(e) => setSelectedTask(e.target.value)}
      >
        <option value="" disabled>
          選択してくださ
        </option>
        <option value="剪定">剪定</option>
        <option value="ふらん病防止薬液塗布">ふらん病防止薬液塗布</option>
        <option value="花摘み">花摘み</option>
        <option value="摘果">摘果</option>
        <option value="徒長枝切り">徒長枝切り</option>
        <option value="葉摘み">葉摘み</option>
        <option value="玉まわし">玉まわし</option>
        <option value="剪定">剪定</option>
        <option value="収穫">収穫</option>
        <option value="消毒">消毒</option>
        <option value="支柱立て">支柱立て</option>
        <option value="選果">選果</option>
        <option value="枝こなし">枝こなし</option>
        <option value="支柱回収">支柱回収</option>
        <option value="剪定">剪定</option>
        <option value="ふらん病防止薬液塗布">ふらん病防止薬液塗布</option>
        <option value="花摘み">花摘み</option>
        <option value="摘果">摘果</option>
        <option value="徒長枝切り">徒長枝切り</option>
        <option value="葉摘み">葉摘み</option>
        <option value="玉まわし">玉まわし</option>
        <option value="消毒">消毒</option>
        <option value="枝こなし">枝こなし</option>
        <option value="ガムテープ貼り（誘引）">ガムテープ貼り（誘引）</option>
        <option value="剪定">剪定</option>
        <option value="摘芽">摘芽</option>
        <option value="誘引">誘引</option>
        <option value="房の整形">房の整形</option>
        <option value="ジベレリン処理">ジベレリン処理</option>
        <option value="摘心">摘心</option>
        <option value="摘粒">摘粒</option>
        <option value="副梢とり">副梢とり</option>
        <option value="袋がけ">袋がけ</option>
        <option value="収穫">収穫</option>
        <option value="消毒">消毒</option>
        <option value="巻きつるとり">巻きつるとり</option>
        <option value="選果">選果</option>
        <option value="剪定">剪定</option>
        <option value="誘引(長梢)">誘引(長梢)</option>
        <option value="誘引(新梢)">誘引(新梢)</option>
        <option value="摘芽">摘芽</option>
        <option value="摘心">摘心</option>
        <option value="副梢切り">副梢切り</option>
        <option value="葉摘み">葉摘み</option>
        <option value="防鳥ネット張り">防鳥ネット張り</option>
        <option value="収穫">収穫</option>
        <option value="消毒">消毒</option>
        <option value="摘粒">摘粒</option>
        <option value="選芽">選芽</option>
        <option value="誘引">誘引</option>
        <option value="蔓まき">蔓まき</option>
        <option value="収穫">収穫</option>
        <option value="糸つけ">糸つけ</option>
        <option value="草刈り">草刈り</option>
        <option value="単管設置">単管設置</option>
        <option value="番線張り">番線張り</option>
        <option value="堆肥場作業">堆肥場作業</option>
      </select>

      {/* Map Container */}
      <div ref={mapRef} style={{ width: "100vw", height: "100vh" }} />

      <Legend />

      {/* Full-Width Sticky Footer */}
      <div className={styles2.footer}>
        <a href="/cultivate/shedule" className={styles2.footerMenu}>
          📅 スケジュール
        </a>
        <Link href="/cultivate/shukaku/f0011" className={styles2.footerMenu}>
          🌾 農作物の情報
        </Link>
      </div>
    </div>
  );
};

export default GoogleMap;
