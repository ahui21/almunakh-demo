'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { MapMarker, CountryData, RiskMetric } from '@/lib/types/dashboard';
import { GlobeScene } from './GlobeScene';
import { cn } from '@/lib/utils';
import { WorldRiskData, loadWorldRiskData } from '@/lib/utils/loadWorldRiskData';

interface GlobeProps {
  markers?: MapMarker[];
  selectedMetric?: RiskMetric;
  countryRisks?: CountryData[];
  className?: string;
}

function Globe({ markers = [], selectedMetric = 'World Risk Index', countryRisks = [], className }: GlobeProps) {
  const [worldRiskData, setWorldRiskData] = useState<WorldRiskData[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadWorldRiskData();
      console.log('Loaded risk data:', data.slice(0, 3)); // Debug log
      setWorldRiskData(data);
    };
    loadData();
  }, []);

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
          selectedMetric={selectedMetric}
          countryRisks={countryRisks}
          worldRiskData={worldRiskData}
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
      </Canvas>
    </div>
  );
}

export default Globe; 