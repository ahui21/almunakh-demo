'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './map.css';
import type { MapMarker, CountryData, MarkerType } from '@/lib/types/dashboard';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

// All interfaces grouped together
interface CustomPopup extends mapboxgl.Popup {
  marker_id?: number;
}

interface MapProps {
  markers: MapMarker[];
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

// Main component
export default function Map({ 
  markers, 
  countryRisks,
  className,
  onLoadingComplete 
}: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<MarkerRefs>({});
  const activePopup = useRef<CustomPopup | null>(null);

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

    // Add proper typing for the map event
    newMap.on('load', (e: mapboxgl.MapboxEvent<'load'>) => {
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    });

    newMap.on('style.load', (e: mapboxgl.MapboxEvent<'style.load'>) => {
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
          .on('dragend', (e: mapboxgl.MapboxEvent<MouseEvent>) => {
            const lngLat = mapMarker.getLngLat();
            console.log('Marker moved to:', lngLat);
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

          // Add popup event handler types
          popup.on('close', (e: mapboxgl.PopupEvent) => {
            if (activePopup.current) {
              activePopup.current = null;
            }
          });

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
      // Cleanup markers
      Object.values(markersRef.current).forEach(marker => marker.remove());
      // Remove popup if exists
      if (activePopup.current) {
        activePopup.current.remove();
      }
      // Remove map
      newMap.remove();
    };
  }, [markers, onLoadingComplete]);

  return (
    <div 
      ref={mapContainer} 
      style={{ 
        width: '100%',
        height: '100%',
        minHeight: '500px'
      }}
    />
  );
}