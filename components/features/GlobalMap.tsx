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

  const handleBackgroundClick = (event: ThreeEvent<MouseEvent>) => {
    if ((event.object as any).type === 'Mesh' && !(event.object as any).userData?.isMarker) {
      setSelectedMarker(null);
    }
  };

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
              onMarkerClick={handleMarkerClick}
              onBackgroundClick={handleBackgroundClick}
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