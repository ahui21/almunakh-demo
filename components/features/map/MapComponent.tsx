'use client';

import { useState } from 'react';
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Get token from environment variable
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function MapComponent() {
  const [viewState, setViewState] = useState({
    longitude: -98.5795,
    latitude: 39.8283,
    zoom: 3
  });

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <span className="text-gray-500">Mapbox token not found</span>
      </div>
    );
  }

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      mapboxAccessToken={MAPBOX_TOKEN}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      reuseMaps
    />
  );
} 