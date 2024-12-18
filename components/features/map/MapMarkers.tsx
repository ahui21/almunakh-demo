'use client';

import { Marker } from 'react-simple-maps';
import type { MapMarker } from '@/lib/types/dashboard';

interface MapMarkersProps {
  markers: MapMarker[];
}

export function MapMarkers({ markers }: MapMarkersProps) {
  return (
    <>
      {markers.map(({ name, coordinates, type }) => (
        <Marker key={name} coordinates={coordinates}>
          <circle r={3} fill="#2D7DD2" />
          <title>{name}</title>
        </Marker>
      ))}
    </>
  );
}