'use client';

import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { mapMarkers } from '@/lib/data/dashboard';

const geoUrl = "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

export function MapContainer() {
  return (
    <div className="h-[350px] bg-blue-50 rounded-lg overflow-hidden">
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
        {mapMarkers.map(({ name, coordinates, type }) => (
          <Marker key={name} coordinates={coordinates}>
            <circle r={3} fill="#2D7DD2" />
            <title>{name}</title>
          </Marker>
        ))}
      </ComposableMap>
    </div>
  );
}