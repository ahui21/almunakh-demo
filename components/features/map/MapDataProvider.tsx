'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { MapMarker } from '@/lib/types/dashboard';

interface MapDataContextType {
  markers: MapMarker[];
}

const MapDataContext = createContext<MapDataContextType | null>(null);

export function MapDataProvider({ 
  children,
  markers 
}: { 
  children: ReactNode;
  markers: MapMarker[];
}) {
  return (
    <MapDataContext.Provider value={{ markers }}>
      {children}
    </MapDataContext.Provider>
  );
}

export function useMapData() {
  const context = useContext(MapDataContext);
  if (!context) {
    throw new Error('useMapData must be used within a MapDataProvider');
  }
  return context;
} 