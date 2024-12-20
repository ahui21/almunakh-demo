'use client';

import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import type { MapMarker, RiskMetric, CountryData, WorldRiskData } from '@/lib/types/dashboard';
import { TextureLoader } from 'three';
import { scaleLinear } from 'd3-scale';
import { feature } from 'topojson-client';
import { useWorldTopology } from '@/lib/hooks/useWorldTopology';
import { ThreeEvent } from '@react-three/fiber';

interface GlobeSceneProps {
  markers: MapMarker[];
  selectedMetric: RiskMetric;
  onMarkerClick?: (marker: MapMarker) => void;
  onBackgroundClick?: (event: ThreeEvent<MouseEvent>) => void;
  countryRisks: CountryData[];
  worldRiskData: WorldRiskData[];
}

// Create color scale for markers
const colorScale = scaleLinear<string>()
  .domain([0, 25, 50, 75, 100])
  .range(['#22C55E', '#86EFAC', '#FCD34D', '#F97316', '#E74C3C'])
  .clamp(true);

// Create color scale for countries
const countryColorScale = scaleLinear<string>()
  .domain([0, 0.25, 0.5, 0.75, 1])
  .range(['#f7fbf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476'])
  .clamp(true);

function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

function createGlowTexture() {
  const size = 64;
  const data = new Uint8Array(size * size * 4);
  
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const index = (i * size + j) * 4;
      const x = (j / size - 0.5) * 2;
      const y = (i / size - 0.5) * 2;
      const distance = Math.sqrt(x * x + y * y);
      const intensity = Math.max(0, 1 - distance);
      const alpha = Math.pow(intensity, 2);
      
      data[index] = 255;     // R
      data[index + 1] = 255; // G
      data[index + 2] = 255; // B
      data[index + 3] = alpha * 255; // A
    }
  }
  
  const texture = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.RGBAFormat,
    THREE.UnsignedByteType
  );
  texture.needsUpdate = true;
  return texture;
}

function getColorForScore(score: number): string {
  if (score >= 75) return '#E74C3C'; // Red for high risk
  if (score >= 50) return '#F97316'; // Orange for medium-high risk
  if (score >= 25) return '#FCD34D'; // Yellow for medium risk
  return '#22C55E'; // Green for low risk
}

function processCountryGeometry(geometry: any, radius: number) {
  if (geometry.type === 'Polygon') {
    return processPolygon(geometry.coordinates, radius);
  } else if (geometry.type === 'MultiPolygon') {
    const allVertices = [];
    const allIndices = [];
    let vertexOffset = 0;

    geometry.coordinates.forEach((polygon: any) => {
      const { vertices, indices } = processPolygon(polygon, radius);
      allVertices.push(...vertices);
      // Adjust indices for the offset
      allIndices.push(...indices.map(i => i + vertexOffset));
      vertexOffset += vertices.length / 3;
    });

    return {
      vertices: allVertices,
      indices: allIndices
    };
  }
  return { vertices: [], indices: [] };
}

function processPolygon(coordinates: any[], radius: number) {
  const vertices: number[] = [];
  const indices: number[] = [];
  let vertexIndex = 0;

  // Process only the outer ring for cleaner borders
  const ring = coordinates[0];
  
  // Add vertices with slight offset for better visibility
  ring.forEach(([lon, lat]: number[]) => {
    const point = latLongToVector3(lat, lon, radius * 1.001); // Slight offset
    vertices.push(point.x, point.y, point.z);
  });

  // Create triangles using fan triangulation
  for (let i = 1; i < ring.length - 1; i++) {
    indices.push(
      vertexIndex,
      vertexIndex + i,
      vertexIndex + i + 1
    );
  }

  return { vertices, indices };
}

export function GlobeScene({ 
  markers, 
  selectedMetric = 'World Risk Index',
  onMarkerClick,
  onBackgroundClick,
  countryRisks,
  worldRiskData 
}: GlobeSceneProps) {
  // All hooks at the top
  const globeRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const [hoveredMarker, setHoveredMarker] = useState<MapMarker | null>(null);
  const { camera } = useThree();
  const { topology, loading, error } = useWorldTopology();
  const radius = 100;

  // Load textures
  const [earthTexture, cloudsTexture] = useLoader(TextureLoader, [
    '/textures/earth-dark.jpg',
    '/textures/clouds.png'
  ]);

  // All useMemo hooks
  const sphereMaterial = useMemo(() => new THREE.MeshPhongMaterial({
    map: earthTexture,
    bumpMap: earthTexture,
    bumpScale: 0.8,
    specularMap: earthTexture,
    specular: new THREE.Color('#666666'),
    shininess: 15,
    emissive: new THREE.Color('#112244'),
    emissiveIntensity: 0.1
  }), [earthTexture]);

  const cloudsMaterial = useMemo(() => new THREE.MeshPhongMaterial({
    map: cloudsTexture,
    transparent: true,
    opacity: 0.5,
    depthWrite: false,
    color: '#ffffff'
  }), [cloudsTexture]);

  const atmosphereMaterial = useMemo(() => new THREE.MeshPhongMaterial({
    color: '#4A90E2',
    opacity: 0.2,
    transparent: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  }), []);

  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(radius, 64, 64), []);
  const atmosphereGeometry = useMemo(() => new THREE.SphereGeometry(radius * 1.015, 64, 64), []);
  const glowTexture = useMemo(() => createGlowTexture(), []);

  const markerPositions = useMemo(() => 
    markers.map(marker => ({
      ...marker,
      position: latLongToVector3(marker.coordinates[1], marker.coordinates[0], radius + 2)
    })), [markers]);

  const countryGeometries = useMemo(() => {
    if (!topology) return [];
    
    const countries = feature(topology, topology.objects.countries);
    return countries.features.map((country: any) => {
      try {
        const { vertices, indices } = processCountryGeometry(country.geometry, radius);
        // Find the risk data for this country
        const riskData = countryRisks.find(risk => risk.id === country.id);
        return {
          id: country.id,
          vertices,
          indices,
          value: riskData?.score ?? 0 // Use actual risk score or default to 0
        };
      } catch (error) {
        console.error(`Error processing country ${country.id}:`, error);
        return null;
      }
    }).filter(Boolean);
  }, [radius, topology, countryRisks]);

  // useFrame hook
  useFrame(() => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0007;
    }
  });

  // Handler functions
  const handleMarkerHover = useCallback((marker: MapMarker | null) => {
    setHoveredMarker(marker);
    document.body.style.cursor = marker ? 'pointer' : 'default';
  }, []);

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    onMarkerClick?.(marker);
  }, [onMarkerClick]);

  // Constants
  const MARKER_SIZE = 2;
  const HOVER_SIZE = 3;
  const GLOW_SCALE = 8;

  // Loading state
  if (loading) {
    return (
      <group>
        <mesh geometry={sphereGeometry} material={sphereMaterial} />
      </group>
    );
  }

  if (error) {
    console.error('Failed to load world topology:', error);
  }

  // Rest of the render code remains the same...
  return (
    <group ref={globeRef}>
      {/* Base sphere */}
      <mesh 
        geometry={sphereGeometry} 
        material={sphereMaterial}
        onClick={onBackgroundClick}
      />
      
      {/* Country boundaries */}
      {countryGeometries.map((country, i) => (
        <mesh key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={country.vertices.length / 3}
              array={new Float32Array(country.vertices)}
              itemSize={3}
            />
            <bufferAttribute
              attach="index"
              array={new Uint16Array(country.indices)}
              count={country.indices.length}
              itemSize={1}
            />
          </bufferGeometry>
          <meshPhongMaterial
            color={countryColorScale(country.value)}
            transparent
            opacity={0.1} // Further reduced for better border contrast
            side={THREE.FrontSide}
            polygonOffset={true}
            polygonOffsetFactor={1}
            polygonOffsetUnits={1}
          />
        </mesh>
      ))}

      {/* Main country borders */}
      {countryGeometries.map((country, i) => (
        <lineSegments key={`border-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={country.vertices.length / 3}
              array={new Float32Array(country.vertices)}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#4A90E2" // Bright blue color
            transparent
            opacity={0.6} // Increased opacity
            linewidth={4} // Thicker lines
          />
        </lineSegments>
      ))}

      {/* Glow effect for borders */}
      {countryGeometries.map((country, i) => (
        <lineSegments key={`border-glow-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={country.vertices.length / 3}
              array={new Float32Array(country.vertices.map((v, i) => 
              v * (1 + (i % 3 === 0 ? 0.0002 : 0)) // Increased offset for more visible glow
            ))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#4A90E2" // Matching blue color
            transparent
            opacity={0.3}
            linewidth={6} // Even thicker for glow effect
          />
        </lineSegments>
      ))}

      {/* Clouds layer */}
      <mesh 
        ref={cloudsRef}
        geometry={new THREE.SphereGeometry(radius * 1.01, 64, 64)}
        material={cloudsMaterial}
      />
      
      {/* Atmosphere */}
      <mesh 
        geometry={atmosphereGeometry} 
        material={atmosphereMaterial}
        scale={1.1} // Slightly larger atmosphere
      />

      {/* Markers with enhanced visibility */}
      {markerPositions.map((marker, i) => (
        <group key={i}>
          {/* Marker glow */}
          <sprite
            position={marker.position}
            scale={[GLOW_SCALE, GLOW_SCALE, 1]}
          >
            <spriteMaterial
              map={glowTexture}
              color={getColorForScore(marker.score)}
              transparent
              opacity={0.6}
              depthWrite={false}
              blending={THREE.AdditiveBlending} // Add glow effect
            />
          </sprite>

          {/* Marker point */}
          <mesh
            position={marker.position}
            onPointerOver={() => handleMarkerHover(marker)}
            onPointerOut={() => handleMarkerHover(null)}
            onClick={(e) => {
              e.stopPropagation();
              handleMarkerClick(marker);
            }}
            userData={{ isMarker: true }}
          >
            <sphereGeometry args={[
              hoveredMarker?.id === marker.id ? HOVER_SIZE : MARKER_SIZE, 
              32, 
              32
            ]} />
            <meshPhongMaterial 
              color={getColorForScore(marker.score)}
              emissive={getColorForScore(marker.score)}
              emissiveIntensity={hoveredMarker?.id === marker.id ? 0.5 : 0.2}
              shininess={100}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
} 