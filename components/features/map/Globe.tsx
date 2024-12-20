'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { MapMarker } from '@/lib/types/dashboard';
import { GlobeScene } from './GlobeScene';
import { cn } from '@/lib/utils';

interface GlobeProps {
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  onBackgroundClick?: (event: any) => void;
  className?: string;
}

export function Globe({ 
  markers = [], 
  onMarkerClick,
  onBackgroundClick,
  className 
}: GlobeProps) {
  return (
    <div className={cn("w-full h-full relative", className)}>
      <Canvas 
        camera={{ 
          position: [200, 200, 200], 
          fov: 45,
          near: 1,
          far: 1000
        }}
        style={{ background: '#000814' }}
      >
        <Suspense fallback={null}>
          {/* Ambient light for general illumination */}
          <ambientLight intensity={0.6} />
          
          {/* Key light */}
          <directionalLight 
            position={[100, 100, 100]} 
            intensity={1} 
            castShadow
          />
          
          {/* Fill light */}
          <directionalLight 
            position={[-100, -100, -100]} 
            intensity={0.5} 
          />
          
          {/* Rim light for edge definition */}
          <pointLight 
            position={[200, 0, -100]} 
            intensity={0.5}
          />
          
          <GlobeScene 
            markers={markers}
            onMarkerClick={onMarkerClick}
            onBackgroundClick={onBackgroundClick}
          />
          
          <OrbitControls
            enableZoom={true}
            enablePan={false}
            enableRotate={true}
            minDistance={150}
            maxDistance={400}
            autoRotate
            autoRotateSpeed={0.5}
          />
        </Suspense>
      </Canvas>
    </div>
  );
} 