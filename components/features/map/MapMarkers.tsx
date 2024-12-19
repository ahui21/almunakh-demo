'use client';

import { Marker } from 'react-simple-maps';
import type { MapMarker } from '@/lib/types/dashboard';

interface MapMarkerProps {
  marker: MapMarker;
  onSelect: (marker: MapMarker) => void;
}

export function MapMarker({ marker, onSelect }: MapMarkerProps) {
  const { coordinates, score } = marker;
  return (
    <Marker key={marker.name} coordinates={coordinates}>
      <circle r={3} fill="#2D7DD2" />
      <title>{marker.name}</title>
    </Marker>
  );
}