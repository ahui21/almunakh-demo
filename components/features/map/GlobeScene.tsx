'use client';

import { useRef, useMemo, useState, useCallback } from 'react';
import { useFrame, useThree, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import type { MapMarker } from '@/lib/types/dashboard';
import { TextureLoader } from 'three';
import { feature } from 'topojson-client';
import { useWorldTopology } from '@/lib/hooks/useWorldTopology';
import { ThreeEvent } from '@react-three/fiber';
import type { Topology, GeometryObject, Objects } from 'topojson-specification';

interface GlobeSceneProps {
  markers: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  onBackgroundClick?: (event: ThreeEvent<MouseEvent>) => void;
}

function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
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
    const allVertices: number[] = [];
    const allIndices: number[] = [];
    let vertexOffset = 0;

    geometry.coordinates.forEach((polygon: any) => {
      const { vertices, indices } = processPolygon(polygon, radius);
      allVertices.push(...vertices);
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
  
  const ring = coordinates[0];
  for (let i = 0; i < ring.length; i++) {
    const [lon, lat] = ring[i];
    const point = latLongToVector3(lat, lon, radius * 1.001);
    vertices.push(point.x, point.y, point.z);
    
    if (i > 0) {
      indices.push(i - 1, i);
    }
  }
  // Close the loop
  if (ring.length > 1) {
    indices.push(ring.length - 1, 0);
  }
  
  return { vertices, indices };
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

// Update the WorldTopology interface
interface WorldTopology extends Topology<{
  countries: {
    type: 'GeometryCollection';
    geometries: Array<GeometryObject & {
      id: string;
      properties: { name: string };
    }>;
  };
}> {}

export function GlobeScene({ 
  markers, 
  onMarkerClick,
  onBackgroundClick 
}: GlobeSceneProps) {
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

  const sphereGeometry = useMemo(() => new THREE.SphereGeometry(radius, 64, 64), []);

  const glowMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color('#4A90E2') },
      viewVector: { value: camera.position }
    },
    vertexShader: `
      uniform vec3 viewVector;
      varying float intensity;
      void main() {
        vec3 vNormal = normalize(normalMatrix * normal);
        vec3 vNormel = normalize(normalMatrix * viewVector);
        intensity = pow(0.6 - dot(vNormal, vNormel), 2.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      varying float intensity;
      void main() {
        vec3 glow = glowColor * intensity;
        gl_FragColor = vec4(glow, 1.0);
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  }), [camera.position]);

  const glowTexture = useMemo(() => createGlowTexture(), []);

  const markerPositions = useMemo(() => 
    markers.map(marker => ({
      ...marker,
      position: latLongToVector3(marker.coordinates[1], marker.coordinates[0], radius + 2)
    })), [markers]);

  const countryGeometries = useMemo(() => {
    if (!topology) return [];
    
    const countries = feature(topology as WorldTopology, (topology as WorldTopology).objects.countries);
    return countries.features.map((country: any) => {
      try {
        const { vertices, indices } = processCountryGeometry(country.geometry, radius);
        return { vertices, indices };
      } catch (error) {
        console.error(`Error processing country ${country.id}:`, error);
        return null;
      }
    }).filter(Boolean);
  }, [radius, topology]);

  useFrame(() => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0007;
    }
  });

  const handleMarkerHover = useCallback((marker: MapMarker | null) => {
    setHoveredMarker(marker);
    document.body.style.cursor = marker ? 'pointer' : 'default';
  }, []);

  const handleMarkerClick = useCallback((marker: MapMarker) => {
    onMarkerClick?.(marker);
  }, [onMarkerClick]);

  const MARKER_SIZE = 2;
  const HOVER_SIZE = 3;
  const GLOW_SCALE = 8;

  if (loading) {
    return (
      <group>
        <mesh geometry={sphereGeometry} material={sphereMaterial} />
      </group>
    );
  }

  return (
    <group ref={globeRef}>
      {/* Atmosphere glow */}
      <mesh geometry={sphereGeometry} material={glowMaterial} scale={1.1} />
      
      {/* Base sphere */}
      <mesh 
        geometry={sphereGeometry} 
        material={sphereMaterial}
        onClick={onBackgroundClick}
      />
      
      {/* Country borders with glow */}
      {countryGeometries.map((country, i) => [
        // Main border
        <lineSegments key={`border-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={country.vertices.length / 3}
              array={new Float32Array(country.vertices)}
              itemSize={3}
            />
            <bufferAttribute
              attach="index"
              count={country.indices.length}
              array={new Uint16Array(country.indices)}
              itemSize={1}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#4A90E2"
            transparent
            opacity={0.6}
            linewidth={12}
          />
        </lineSegments>,

        // Border glow
        <lineSegments key={`border-glow-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={country.vertices.length / 3}
              array={new Float32Array(country.vertices.map((v, i) => 
                v * (1 + (i % 3 === 0 ? 0.0004 : 0))
              ))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#4A90E2"
            transparent
            opacity={0.3}
            linewidth={18}
          />
        </lineSegments>
      ])}

      {/* Clouds layer */}
      <mesh 
        ref={cloudsRef}
        geometry={new THREE.SphereGeometry(radius * 1.01, 64, 64)}
        material={cloudsMaterial}
      />

      {/* Markers with glow effect */}
      {markerPositions.map((marker, i) => (
        <group key={i}>
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
              blending={THREE.AdditiveBlending}
            />
          </sprite>

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