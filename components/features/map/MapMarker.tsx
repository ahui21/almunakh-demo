'use client';

import { MapMarker } from '@/lib/types/dashboard';
import { Marker } from 'react-simple-maps';

interface MapMarkerProps {
  marker: MapMarker;
}

const markerColors = {
  hurricane: '#FF4444',
  heatwave: '#FF8C00',
  drought: '#8B4513',
};

export function MapMarkerComponent({ marker }: MapMarkerProps) {
  return (
    <Marker coordinates={marker.coordinates}>
      <circle
        r={4}
        fill={markerColors[marker.type]}
        stroke="#FFFFFF"
        strokeWidth={2}
      />
      <title>{marker.name}</title>
    </Marker>
  );
}