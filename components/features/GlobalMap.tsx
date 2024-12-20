'use client';

import { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { GlobeScene } from './map/GlobeScene';
import { MarkerInfoCard } from './map/MarkerInfoCard';
import { Card } from '@/components/ui/card';
import { CardHeader } from '@/components/features/shared/CardHeader';
import { cn } from '@/lib/utils';
import type { MapMarker, CountryData, WorldRiskData } from '@/lib/types/dashboard';
import { mapMarkers } from '@/lib/data/dashboard';

// Add mock data with correct types
const mockCountryRisks: CountryData[] = [
  {
    id: 'USA',
    country: 'United States',
    scores: {
      'World Risk Index': 75,
      'Natural Disasters': 65,
      'Infrastructure': 85
    },
    year: 2024
  },
  {
    id: 'GBR',
    country: 'United Kingdom',
    scores: {
      'World Risk Index': 50,
      'Natural Disasters': 45,
      'Infrastructure': 70
    },
    year: 2024
  },
  {
    id: 'FRA',
    country: 'France',
    scores: {
      'World Risk Index': 30,
      'Natural Disasters': 35,
      'Infrastructure': 60
    },
    year: 2024
  }
];

const mockWorldRiskData: WorldRiskData[] = [
  {
    id: 'WRI',
    name: 'World Risk Index',
    value: 65,
    trend: 'up',
    lastUpdated: '2024-02-24'
  }
];

interface GlobalMapProps {
  className?: string;
}

function CameraControls() {
  return (
    <OrbitControls
      enableZoom={true}
      enablePan={false}
      enableRotate={true}
      minDistance={150}
      maxDistance={400}
      autoRotate={false}
      makeDefault
    />
  );
}

export function GlobalMap({ className }: GlobalMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  // Handle click away
  const handleBackgroundClick = (event: ThreeEvent<MouseEvent>) => {
    if ((event.object as any).type === 'Mesh' && !(event.object as any).userData?.isMarker) {
      setSelectedMarker(null);
    }
  };

  // Handle marker click
  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(current => current?.id === marker.id ? null : marker);
  };

  return (
    <Card className={cn('p-6', className)}>
      <CardHeader title="Global Overview" />
      <div className="h-[calc(100%-3rem)] rounded-lg overflow-hidden relative">
        <Canvas
          camera={{ 
            position: [200, 200, 200], 
            fov: 45,
            near: 1,
            far: 1000
          }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[100, 100, 100]} intensity={1} />
            <directionalLight position={[-100, -100, -100]} intensity={0.5} />
            <pointLight position={[200, 0, -100]} intensity={0.5} />
            
            <GlobeScene 
              markers={mapMarkers}
              selectedMetric="World Risk Index"
              onMarkerClick={handleMarkerClick}
              onBackgroundClick={handleBackgroundClick}
              countryRisks={mockCountryRisks}
              worldRiskData={mockWorldRiskData}
            />
            
            <CameraControls />
          </Suspense>
        </Canvas>

        {selectedMarker && (
          <MarkerInfoCard 
            marker={selectedMarker} 
            onClose={() => setSelectedMarker(null)}
          />
        )}
      </div>
    </Card>
  );
}