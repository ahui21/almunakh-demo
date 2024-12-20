'use client';

import { useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './map.css';
import type { MapMarker } from '@/lib/types/dashboard';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// All interfaces grouped together
interface CustomPopup extends mapboxgl.Popup {
  marker_id?: number;
}

interface MapProps {
  markers?: MapMarker[];
  className?: string;
  onLoadingComplete?: () => void;
}

interface MarkerStyle extends CSSStyleDeclaration {
  width: string;
  height: string;
  backgroundColor: string;
  borderRadius: string;
  border: string;
  boxShadow: string;
  cursor: string;
}

interface MarkerRefs {
  [key: number]: mapboxgl.Marker;
}

// Main component
export default function MapComponent(props?: MapProps) {
  const {
    markers = [],
    onLoadingComplete
  } = props || {};

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkerRefs>({});
  const activePopup = useRef<CustomPopup | null>(null);
  const hoveredStateId = useRef<string | number | null>(null);
  const hoverPopup = useRef<mapboxgl.Popup | null>(null);

  // Move the helper functions here
  const setupMapLayers = useCallback((map: mapboxgl.Map) => {
    map.addSource('countries', {
      type: 'vector',
      url: 'mapbox://mapbox.country-boundaries-v1'
    });

    map.addLayer({
      id: 'country-fills',
      type: 'fill',
      source: 'countries',
      'source-layer': 'country_boundaries',
      paint: {
        'fill-color': '#cccccc',
        'fill-opacity': 0.7
      }
    });

    map.addLayer({
      id: 'country-borders',
      type: 'line',
      source: 'countries',
      'source-layer': 'country_boundaries',
      paint: {
        'line-color': '#627BC1',
        'line-width': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          2,
          0.5
        ]
      }
    });
  }, []);

  const setupMapInteractions = useCallback((map: mapboxgl.Map) => {
    map.on('mousemove', 'country-fills', (e) => {
      if (e.features && e.features.length > 0) {
        if (hoveredStateId.current !== null) {
          map.setFeatureState(
            { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredStateId.current },
            { hover: false }
          );
        }
        const featureId = e.features[0].id;
        if (featureId !== undefined) {
          hoveredStateId.current = featureId;
          map.setFeatureState(
            { source: 'countries', sourceLayer: 'country_boundaries', id: featureId },
            { hover: true }
          );
        }

        const countryName = e.features[0].properties?.name_en;
        map.getCanvas().style.cursor = 'pointer';
        
        // Remove existing hover popup if any
        if (hoverPopup.current) {
          hoverPopup.current.remove();
        }
        
        // Create new popup
        hoverPopup.current = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        })
          .setLngLat(e.lngLat)
          .setHTML(`
            <div style="
              font-family: var(--font-inter);
              padding: 8px;
              background-color: white;
              border-radius: 4px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            ">
              <div style="font-weight: 500;">${countryName}</div>
            </div>
          `)
          .addTo(map);
      }
    });

    map.on('mouseleave', 'country-fills', () => {
      if (hoveredStateId.current !== null) {
        map.setFeatureState(
          { source: 'countries', sourceLayer: 'country_boundaries', id: hoveredStateId.current },
          { hover: false }
        );
      }
      hoveredStateId.current = null;
      map.getCanvas().style.cursor = '';
      
      // Remove hover popup
      if (hoverPopup.current) {
        hoverPopup.current.remove();
        hoverPopup.current = null;
      }
    });
  }, []);

  // Initial map setup and country data loading
  useEffect(() => {
    let mounted = true;
    
    const initMap = async () => {
      if (!mapContainer.current || !mapboxgl.accessToken) return;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [0, 20],
        zoom: 2,
        projection: 'mercator'
      });

      if (!mounted) {
        newMap.remove();
        return;
      }
      map.current = newMap;
      
      try {
        if (mounted) {
          setupMapLayers(newMap);
          setupMapInteractions(newMap);
          onLoadingComplete?.();
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initMap();
    return () => {
      mounted = false;
      map.current?.remove();
    };
  }, [onLoadingComplete, setupMapInteractions, setupMapLayers]);

  const cleanup = () => {
    if (map.current) {
      Object.values(markersRef.current).forEach(marker => marker.remove());
      if (activePopup.current) {
        activePopup.current.remove();
      }
      if (hoverPopup.current) {
        hoverPopup.current.remove();
      }
      map.current.remove();
    }
  };

  const handleMarkerClick = useCallback((e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
    // ... existing code
  }, []);

  const handleMapLoad = useCallback((e: mapboxgl.MapboxEvent) => {
    // ... existing code
  }, []);

  return (
    <div 
      ref={mapContainer} 
      className={cn("w-full h-full min-h-[500px]", props?.className)}
    />
  );
}