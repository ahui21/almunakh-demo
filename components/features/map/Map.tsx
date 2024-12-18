'use client';

import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { MapMarkerComponent } from './MapMarker';
import type { MapMarker } from '@/lib/types/dashboard';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

interface MapProps {
  markers: MapMarker[];
}

export default function Map({ markers }: MapProps) {
  return (
    <div className="h-[calc(100%-5rem)] bg-blue-50 rounded-lg overflow-hidden">
      <ComposableMap projectionConfig={{ scale: 140 }}>
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#D6D6DA"
                stroke="#9998A3"
                strokeWidth={0.5}
                style={{
                  default: { outline: 'none' },
                  hover: { fill: "#F5F4F6", outline: 'none' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>
        {markers.map((marker) => (
          <MapMarkerComponent key={marker.name} marker={marker} />
        ))}
      </ComposableMap>
    </div>
  );
}