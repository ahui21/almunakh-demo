import { MapMarker } from '@/lib/types/dashboard';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';

interface MarkerInfoCardProps {
  marker: MapMarker;
  onClose?: () => void;
}

export function MarkerInfoCard({ marker, onClose }: MarkerInfoCardProps) {
  return (
    <Card className="absolute top-4 left-4 w-[300px] overflow-hidden rounded-xl">
      {/* Header */}
      <div className="bg-[#2B4ACB] p-3 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{marker.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-[#E74C3C] text-white text-lg font-bold px-2 py-0.5 rounded">
            {marker.score}
          </div>
          <div className="bg-[#4A90E2] text-white px-3 py-0.5 rounded text-sm">
            {marker.type}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-3">
        <div className="grid grid-cols-2 gap-4">
          {/* Left Column - Dates */}
          <div className="space-y-2">
            <div>
              <h4 className="text-[#2B4ACB] text-sm font-medium">Start Date</h4>
              <p className="text-[#2B4ACB] text-base">
                {format(new Date(marker.startDate), 'M/d/yyyy')}
              </p>
            </div>
            <div>
              <h4 className="text-[#2B4ACB] text-sm font-medium">End Date</h4>
              <p className="text-[#2B4ACB] text-base">
                {format(new Date(marker.endDate), 'M/d/yyyy')}
              </p>
            </div>
          </div>
          
          {/* Right Column - Affected Areas */}
          <div>
            <h4 className="text-[#2B4ACB] text-sm font-medium mb-1">
              Affected Areas
            </h4>
            <div className="space-y-1">
              {marker.affectedAreas?.map((area, index) => (
                <p 
                  key={index} 
                  className="text-[#2B4ACB] text-sm"
                >
                  {area}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
} 