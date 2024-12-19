'use client';

import { useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './map.css';
import type { MapMarker, CountryData, MarkerType, RiskMetric } from '@/lib/types/dashboard';
import { scaleLinear } from 'd3-scale';
import { cn } from '@/lib/utils';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// All interfaces grouped together
interface CustomPopup extends mapboxgl.Popup {
  marker_id?: number;
}

interface MapProps {
  markers?: MapMarker[];
  selectedMetric?: RiskMetric;
  countryRisks?: CountryData[];
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

interface PopupContent {
  name: string;
  score: number;
  type: MarkerType;
  startDate: string;
  endDate: string;
  affectedAreas: string[];
}

// Utility functions for marker and popup styling
function getMarkerColor(score: number): string {
  if (score >= 80) return '#EF4444';
  if (score >= 50) return '#F59E0B';
  return '#22C55E';
}

function getTypeColor(type: MarkerType): string {
  switch (type) {
    case 'Hurricane':
      return '#3B82F6';
    case 'Drought':
      return '#F97316';
    case 'Heat Wave':
      return '#EF4444';
    default:
      return '#6B7280';
  }
}

function createPopupHTML(content: PopupContent): string {
  const {name, score, type, startDate, endDate, affectedAreas} = content;
  return `
    <div style="
      font-family: var(--font-inter);
      padding: 8px;
      width: 320px;
      border-radius: 6px;
      background-color: #EFF6FF;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    ">
      <!-- Header -->
      <div style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: -8px;
        margin-bottom: 8px;
        padding: 12px 16px;
        background-color: #1e40af;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
      ">
        <!-- Left side: Name -->
        <h3 style="
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: white;
          line-height: 1.2;
        ">${name}</h3>
        <!-- Right side: Score and Type -->
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <div style="
            padding: 4px 8px;
            border-radius: 4px;
            background-color: ${getMarkerColor(score)};
            font-size: 17px;
            font-weight: 700;
            color: white;
            min-width: 32px;
            text-align: center;
          ">${score}</div>
          <div style="
            padding: 4px 8px;
            border-radius: 4px;
            background-color: ${getTypeColor(type)};
            font-size: 14px;
            font-weight: 500;
            color: white;
          ">${type}</div>
        </div>
      </div>
      <!-- Content -->
      <div style="padding: 0 12px;">
        <div style="
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 16px;
        ">
          <!-- Column 1: Dates -->
          <div>
            <div>
              <div style="
                font-size: 14px;
                color: #1e40af;
                opacity: 0.8;
                margin-bottom: 4px;
              ">Start Date</div>
              <div style="
                font-size: 15px;
                color: #1e40af;
                font-weight: 500;
                margin-bottom: 12px;
              ">${new Date(startDate).toLocaleDateString()}</div>
            </div>
            <div>
              <div style="
                font-size: 14px;
                color: #1e40af;
                opacity: 0.8;
                margin-bottom: 4px;
              ">End Date</div>
              <div style="
                font-size: 15px;
                color: #1e40af;
                font-weight: 500;
              ">${new Date(endDate).toLocaleDateString()}</div>
            </div>
          </div>
          <!-- Column 2: Locations -->
          <div>
            <div style="
              font-size: 14px;
              color: #1e40af;
              opacity: 0.8;
              margin-bottom: 4px;
            ">Affected Areas</div>
            <ul style="
              margin: 0;
              padding-left: 16px;
              color: #1e40af;
              font-size: 15px;
              line-height: 1.4;
            ">
              ${affectedAreas.map(area => `
                <li style="margin-bottom: 4px;">${area}</li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;
}

// Update the color scale utility function
const colorScale = scaleLinear<string>()
  .domain([0, 25, 50, 75, 100])  // More granular scale points
  .range([
    '#22C55E',  // Dark green (0)
    '#86EFAC',  // Light green (25)
    '#FCD34D',  // Yellow (50)
    '#F97316',  // Orange (75)
    '#EF4444'   // Red (100)
  ])
  .clamp(true); // Ensure values outside 0-100 are clamped to the range

// Main component
export default function MapComponent(props?: MapProps) {
  const {
    markers = [],
    selectedMetric = 'World Risk Index',
    onLoadingComplete
  } = props || {};

  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkerRefs>({});
  const activePopup = useRef<CustomPopup | null>(null);
  const countryDataRef = useRef<Map<string, Record<RiskMetric, number>>>(new Map());
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
        'fill-color': [
          'match',
          ['get', 'name_en'],
          ...Array.from(countryDataRef.current.entries()).flatMap(([country, data]) => [
            country,
            colorScale(data[selectedMetric] || 0)
          ]),
          '#cccccc'
        ],
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
  }, [selectedMetric]);

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
        const countryData = countryDataRef.current.get(countryName);
        if (countryData) {
          const score = countryData[selectedMetric];
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
                <div style="color: #666;">
                  ${selectedMetric}: ${score.toFixed(1)}
                </div>
              </div>
            `)
            .addTo(map);
        }
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
  }, [selectedMetric]);

  // Initial map setup and country data loading
  useEffect(() => {
    if (!mapContainer.current || !mapboxgl.accessToken) return;

    const newMap = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [0, 20],
      zoom: 2,
      projection: 'mercator'
    });

    map.current = newMap;

    // Load country data
    newMap.on('load', async () => {
      try {
        const response = await fetch('/data/world_risk_index_cleaned.csv');
        const data = await response.text();
        const rows = data.split('\n').slice(1);
        
        rows.forEach(row => {
          const [country, wri, exposure, vulnerability, susceptibility, coping, adaptive] = row.split(',');
          countryDataRef.current.set(country.trim(), {
            'World Risk Index': parseFloat(wri),
            'Exposure': parseFloat(exposure),
            'Vulnerability': parseFloat(vulnerability),
            'Susceptibility': parseFloat(susceptibility),
            'Lack of Coping Capabilities': parseFloat(coping),
            'Lack of Adaptive Capacities': parseFloat(adaptive)
          });
        });

        setupMapLayers(newMap);
        setupMapInteractions(newMap);

        if (onLoadingComplete) {
          onLoadingComplete();
        }
      } catch (error) {
        console.error('Error loading country data:', error);
      }
    });

    // Inside the first useEffect, after the map.current = newMap; line
    newMap.on('style.load', () => {
      markers.forEach(marker => {
        // Create marker element
        const el = document.createElement('div') as HTMLDivElement;
        el.className = 'marker';
        Object.assign(el.style, {
          width: '30px',
          height: '30px',
          backgroundColor: getMarkerColor(marker.score),
          borderRadius: '50%',
          border: '4px solid white',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          cursor: 'pointer'
        } as MarkerStyle);

        // Create marker
        const mapMarker = new mapboxgl.Marker(el)
          .setLngLat(marker.coordinates)
          .addTo(newMap)
          .on('dragend', () => {
            const lngLat = mapMarker.getLngLat();
            marker.coordinates = [lngLat.lng, lngLat.lat];
          });

        // Store marker reference
        markersRef.current[marker.id] = mapMarker;

        // Add click handler
        el.onclick = (e: MouseEvent) => {
          e.stopPropagation();
          
          // If there's an active popup and it's for this marker, remove it
          if (activePopup.current && marker.id === activePopup.current.marker_id) {
            activePopup.current.remove();
            activePopup.current = null;
            return;
          }

          // Remove any existing popup
          if (activePopup.current) {
            activePopup.current.remove();
            activePopup.current = null;
          }

          // Create and show new popup
          const popup = new mapboxgl.Popup({
            offset: [0, -30],
            closeButton: false,
            className: 'custom-popup',
            anchor: 'bottom'
          }) as CustomPopup;

          // Add marker_id to popup for identification
          popup.marker_id = marker.id;

          popup
            .setLngLat(marker.coordinates)
            .setHTML(createPopupHTML({
              name: marker.name,
              score: marker.score,
              type: marker.type,
              startDate: marker.startDate,
              endDate: marker.endDate,
              affectedAreas: marker.affectedAreas
            }))
            .addTo(newMap);

          activePopup.current = popup;
        };
      });
    });

    return () => {
      cleanup();
    };
  }, [markers, onLoadingComplete, setupMapInteractions, setupMapLayers]);

  // Update colors when metric changes
  useEffect(() => {
    if (!map.current || !map.current.getLayer('country-fills')) return;

    map.current.setPaintProperty('country-fills', 'fill-color', [
      'match',
      ['get', 'name_en'],
      ...Array.from(countryDataRef.current.entries()).flatMap(([country, data]) => [
        country,
        colorScale(data[selectedMetric] || 0)
      ]),
      '#cccccc'
    ]);
  }, [selectedMetric]);

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

  return (
    <div 
      ref={mapContainer} 
      className={cn("w-full h-full min-h-[500px]", props?.className)}
    />
  );
}