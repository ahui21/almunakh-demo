import { processMapData } from '@/lib/utils/map-data';
import Map from './Map';
import type { MapMarker, RiskMetric, CountryData } from '@/lib/types/dashboard';
import { Loader2 } from 'lucide-react';

interface ServerMapProps {
  markers: MapMarker[];
  className?: string;
  selectedMetric?: RiskMetric;
  onLoadingComplete?: () => void;
}

interface MapError {
  message: string;
  code: 'FETCH_ERROR' | 'PARSE_ERROR' | 'PROCESS_ERROR';
  details?: unknown;
}

export async function ServerMap({ 
  markers,
  className,
  selectedMetric = 'World Risk Index',
  onLoadingComplete
}: ServerMapProps) {
  try {
    // Fetch the CSV data first
    const response = await fetch('/data/world_risk_index.csv');
    if (!response.ok) {
      throw new Error(`Failed to fetch CSV data: ${response.statusText}`);
    }

    const fileContent = await response.text();
    if (!fileContent) {
      throw new Error('CSV file is empty');
    }

    const rows = fileContent.split('\n').filter(row => row.trim());
    if (rows.length < 2) { // At least headers + 1 row
      throw new Error('CSV file has insufficient data');
    }
    
    const countryRisks = await processMapData(rows, selectedMetric);
    
    if (countryRisks.length === 0) {
      console.warn('No country risk data was processed');
    }

    return (
      <Map 
        markers={markers} 
        countryRisks={countryRisks}
        selectedMetric={selectedMetric}
        className={className}
        onLoadingComplete={onLoadingComplete}
      />
    );
  } catch (error: unknown) {
    const mapError: MapError = {
      message: 'Failed to load map data',
      code: 'FETCH_ERROR',
      details: error instanceof Error ? error.message : String(error)
    };

    console.error('Map data error:', mapError);

    // Fallback UI with error state
    return (
      <div className={`relative ${className}`}>
        <Map 
          markers={markers} 
          className={className}
          onLoadingComplete={onLoadingComplete}
        />
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-red-500 font-medium">{mapError.message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-sm text-blue-500 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }
}

// Loading component
function MapLoading() {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      <div className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-gray-600">Loading map data...</span>
      </div>
    </div>
  );
} 