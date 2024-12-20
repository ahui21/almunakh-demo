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
import type { MapMarker } from '@/lib/types/dashboard';
import { mapMarkers } from '@/lib/data/dashboard';

// Add mock data for now - replace with real data later
const mockCountryRisks = [
  { id: 'USA', score: 0.75 },
  { id: 'GBR', score: 0.5 },
  { id: 'FRA', score: 0.3 },
  // Add more countries as needed
];

const mockWorldRiskData = [
  { id: 'WRI', name: 'World Risk Index', value: 0.65 },
  // Add more risk data as needed
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