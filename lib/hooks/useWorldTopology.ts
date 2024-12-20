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
    fetch('https://unpkg.com/world-atlas@2/countries-50m.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setTopology(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  return { topology, loading, error };
} 