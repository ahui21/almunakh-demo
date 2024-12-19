import { getData } from '@/lib/utils/map-data';
import Map from './Map';
import type { MapMarker, RiskMetric, CountryData } from '@/lib/types/dashboard';

interface ServerMapProps {
  markers: MapMarker[];
  className?: string;
  selectedMetric?: RiskMetric;
  onLoadingComplete?: () => void;
  countryRisks?: CountryData[];
}

export async function ServerMap({ 
  markers,
  className,
  selectedMetric = 'World Risk Index',
  onLoadingComplete
}: ServerMapProps) {
  try {
    const countryRisks = await getData(selectedMetric);
    
    return (
      <Map 
        markers={markers} 
        countryRisks={countryRisks}
        className={className}
        onLoadingComplete={onLoadingComplete}
      />
    );
  } catch (error: unknown) {
    console.error('Failed to load map data:', 
      error instanceof Error ? error.message : 'Unknown error'
    );
    // Return map without country risks
    return (
      <Map 
        markers={markers} 
        className={className}
        onLoadingComplete={onLoadingComplete}
      />
    );
  }
} 