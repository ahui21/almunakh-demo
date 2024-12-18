import { Flame, Droplets, Wind, Zap } from 'lucide-react';
import type { Location, Risk, Initiative as DashboardInitiative, MapMarker } from '../types/dashboard';

interface SubInitiative {
  id: number;
  name: string;
  status: 'In Progress' | 'Completed' | 'Planned';
  progress: number;
}

export const locations: Location[] = [
  { name: 'New York', score: 85, trend: 'up' },
  { name: 'Los Angeles', score: 78, trend: 'down' },
  { name: 'Miami', score: 92, trend: 'up' },
  { name: 'Chicago', score: 75, trend: 'down' },
  { name: 'Houston', score: 88, trend: 'up' },
];

export const risks: Risk[] = [
  { name: 'Wildfire', score: 85, trend: 'up', icon: Flame },
  { name: 'Flooding', score: 78, trend: 'down', icon: Droplets },
  { name: 'Hurricanes', score: 72, trend: 'up', icon: Wind },
  { name: 'Power Outages', score: 65, trend: 'down', icon: Zap },
];

export const initiatives: DashboardInitiative[] = [
  {
    id: 1,
    name: 'Climate Risk Assessment',
    status: 'In Progress',
    progress: 75,
    dueDate: '2024-06-15',
    poc: 'John Doe',
    subInitiatives: [
      {
        id: 1,
        name: 'Data Collection',
        status: 'Completed',
        progress: 100,
        dueDate: '2024-03-15',
        poc: 'Sarah Smith'
      },
      {
        id: 2,
        name: 'Risk Analysis',
        status: 'In Progress',
        progress: 60,
        dueDate: '2024-05-01',
        poc: 'Mike Johnson'
      },
      {
        id: 3,
        name: 'Report Generation',
        status: 'Planning',
        progress: 20,
        dueDate: '2024-06-10',
        poc: 'Emily Brown'
      }
    ]
  },
  {
    id: 2,
    name: 'Waste Reduction Program',
    status: 'Planning',
    progress: 25,
    dueDate: '2024-07-30',
    poc: 'Jane Doe'
  },
  {
    id: 3,
    name: 'Carbon Offset Project',
    status: 'Completed',
    progress: 100,
    dueDate: '2024-05-01',
    poc: 'Bob Smith'
  },
];

export const mapMarkers: MapMarker[] = [
  { name: "Hurricane Sandy", coordinates: [-74.006, 40.7128], type: "hurricane" },
  { name: "Heat Wave", coordinates: [2.3522, 48.8566], type: "heatwave" },
  { name: "Drought", coordinates: [138.2529, -34.9285], type: "drought" },
];