'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './map.css';
import type { MapMarker } from '@/lib/types/dashboard';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function Map({ markers }: { markers: MapMarker[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const activePopup = useRef<mapboxgl.Popup | null>(null);

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

    newMap.on('style.load', () => {
      markers.forEach(marker => {
        // Create marker element
        const el = document.createElement('div');
        Object.assign(el.style, {
          width: '30px',
          height: '30px',
          backgroundColor: getMarkerColor(marker.score),
          borderRadius: '50%',
          border: '4px solid white',
          boxShadow: '0 0 10px rgba(0,0,0,0.5)',
          cursor: 'pointer'
        });

        // Create marker
        const mapMarker = new mapboxgl.Marker(el)
          .setLngLat(marker.coordinates)
          .addTo(newMap);

        // Store marker reference
        markersRef.current[marker.id] = mapMarker;

        // Add click handler
        el.onclick = (e) => {
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
          });

          // Add marker_id to popup for identification
          popup.marker_id = marker.id;

          popup
            .setLngLat(marker.coordinates)
            .setHTML(`
              <div style="
                font-family: var(--font-inter);
                padding: 8px;
                min-width: 360px;
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
                  padding: 10px 14px;
                  background-color: #1e40af;
                  border-top-left-radius: 6px;
                  border-top-right-radius: 6px;
                ">
                  <!-- Left side: Name -->
                  <h3 style="
                    margin: 0;
                    font-size: 16px;
                    font-weight: 600;
                    color: white;
                  ">${marker.name}</h3>
                  <!-- Right side: Score and Type -->
                  <div style="
                    display: flex;
                    align-items: center;
                    gap: 8px;
                  ">
                    <div style="
                      padding: 3px 8px;
                      border-radius: 4px;
                      background-color: ${getMarkerColor(marker.score)};
                      font-size: 15px;
                      font-weight: 600;
                      color: white;
                    ">${marker.score}</div>
                    <div style="
                      padding: 3px 8px;
                      border-radius: 4px;
                      background-color: ${getTypeColor(marker.type)};
                      font-size: 14px;
                      font-weight: 500;
                      color: white;
                    ">${marker.type}</div>
                  </div>
                </div>
                <!-- Content -->
                <div style="padding: 0 8px;">
                  <div style="
                    display: grid;
                    grid-template-columns: 1fr 2fr;
                    gap: 16px;
                  ">
                    <!-- Column 1: Dates -->
                    <div>
                      <div>
                        <div style="
                          font-size: 13px;
                          color: #1e40af;
                          opacity: 0.8;
                          margin-bottom: 3px;
                        ">Start Date</div>
                        <div style="
                          font-size: 15px;
                          color: #1e40af;
                          font-weight: 500;
                          margin-bottom: 12px;
                        ">${new Date(marker.startDate).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div style="
                          font-size: 13px;
                          color: #1e40af;
                          opacity: 0.8;
                          margin-bottom: 3px;
                        ">End Date</div>
                        <div style="
                          font-size: 15px;
                          color: #1e40af;
                          font-weight: 500;
                        ">${new Date(marker.endDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <!-- Column 2: Locations (now wider) -->
                    <div>
                      <div style="
                        font-size: 13px;
                        color: #1e40af;
                        opacity: 0.8;
                        margin-bottom: 3px;
                      ">Affected Areas</div>
                      <ul style="
                        margin: 0;
                        padding-left: 16px;
                        color: #1e40af;
                        font-size: 15px;
                        line-height: 1.4;
                      ">
                        ${marker.affectedAreas.map(area => `
                          <li>${area}</li>
                        `).join('')}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            `)
            .addTo(newMap);

          activePopup.current = popup;
        };
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [markers]);

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

function getMarkerColor(score: number): string {
  if (score >= 80) return '#EF4444';
  if (score >= 50) return '#F59E0B';
  return '#22C55E';
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'Hurricane':
      return '#3B82F6'; // Blue
    case 'Drought':
      return '#F97316'; // Orange
    case 'Heat Wave':
      return '#EF4444'; // Red
    default:
      return '#6B7280'; // Gray
  }
}