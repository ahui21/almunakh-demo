import { useState, useEffect } from 'react';

interface WorldTopology {
  type: string;
  objects: {
    countries: {
      type: string;
      geometries: any[];
    };
  };
  arcs: any[];
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
        if (!data.type || !data.objects?.countries || !data.arcs) {
          throw new Error('Invalid topology data structure');
        }
        console.log('Loaded topology data:', {
          type: data.type,
          objectKeys: Object.keys(data.objects),
          arcsLength: data.arcs?.length
        });
        setTopology(data);
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