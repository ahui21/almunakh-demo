import { MapMarker } from '@/lib/types/dashboard';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { scaleLinear } from 'd3-scale';

interface MarkerInfoCardProps {
  marker: MapMarker;
  onClose?: () => void;
}

// Create a continuous color scale from green to yellow to red
const colorScale = scaleLinear<string>()
  .domain([0, 50, 100])
  .range(['#22c55e', '#eab308', '#ef4444'])  // green -> yellow -> red
  .clamp(true);

export function MarkerInfoCard({ marker, onClose }: MarkerInfoCardProps) {
  return (
    <Card className="absolute top-4 left-4 w-[300px] overflow-hidden rounded-xl">
      {/* Header */}
      <div className="bg-[#2B4ACB] p-3 flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white">{marker.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="text-white text-base font-bold px-1 py-0.25 rounded"
            style={{ 
              backgroundColor: colorScale(marker.score),
              transition: 'background-color 0.2s ease-in-out'
            }}
          >
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