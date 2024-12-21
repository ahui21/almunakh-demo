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
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      minPolarAngle={Math.PI / 4}
      maxPolarAngle={Math.PI / 1.5}
      target={[0, 0, 0]}
    />
  );
}

export function GlobalMap({ className }: GlobalMapProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleBackgroundClick = (event: ThreeEvent<MouseEvent>) => {
    if ((event.object as any).type === 'Mesh' && !(event.object as any).userData?.isMarker) {
      setSelectedMarker(null);
    }
  };

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(current => current?.id === marker.id ? null : marker);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <Card 
      className={cn(
        "p-6",
        "transition-all duration-1000",
        isFullscreen ? 
          "fixed top-20 left-56 right-4 bottom-[150rem] z-50 !scale-100 opacity-100" : 
          "scale-100 opacity-100",
        className
      )}
      style={{
        transformOrigin: 'center center',
        transition: 'all 1000ms cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      <CardHeader 
        title="Global Overview"
        action={
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFullscreen}
            className="hover:bg-blue-100 mr-2"
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" />
            ) : (
              <Maximize2 className="h-5 w-5" />
            )}
          </Button>
        }
      />
      <div className="h-[calc(100%-3rem)] rounded-lg overflow-hidden relative">
        <Canvas
          camera={{ 
            position: [50, 150, 200],
            fov: 30,
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