import { useState, useEffect } from 'react';
import type { Topology, GeometryCollection } from 'topojson-specification';

interface WorldTopology extends Topology<{
  countries: GeometryCollection;
}> {
  type: "Topology";
  objects: {
    countries: {
      type: "GeometryCollection";
      geometries: Array<{
        type: string;
        id: string;
        properties: { name: string };
        geometry: {
          type: "Polygon" | "MultiPolygon";
          coordinates: number[][][];
        };
      }>;
    };
  };
}

export function useWorldTopology() {
  const [topology, setTopology] = useState<WorldTopology | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch('/data/world.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTopology(data as WorldTopology);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load topology:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  return { topology, loading, error };
} 