import Map from './Map';
import type { MapMarker } from '@/lib/types/dashboard';
import { Loader2 } from 'lucide-react';

interface ServerMapProps {
  markers?: MapMarker[];
  className?: string;
  onLoadingComplete?: () => void;
}

export async function ServerMap({ 
  markers,
  className,
  onLoadingComplete
}: ServerMapProps) {
  return (
    <Map 
      markers={markers} 
      className={className}
      onLoadingComplete={onLoadingComplete}
    />
  );
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