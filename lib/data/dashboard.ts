import { Flame, Droplets, Wind, Zap } from 'lucide-react';
import type { Location, Risk, Initiative as DashboardInitiative, MapMarker } from '../types/dashboard';

interface SubInitiative {
  id: number;
  name: string;
  status: 'In Progress' | 'Completed' | 'Planning';
  progress: number;
  dueDate: string;
  poc: string;
}

export const locations: Location[] = [
  { id: 1, name: 'New York', score: 85, trend: 'up' },
  { id: 2, name: 'Los Angeles', score: 78, trend: 'down' },
  { id: 3, name: 'Miami', score: 92, trend: 'up' },
  { id: 4, name: 'Chicago', score: 75, trend: 'down' },
  { id: 5, name: 'Houston', score: 88, trend: 'up' },
];

export const risks: Risk[] = [
  { id: 1, name: 'Wildfire', score: 85, trend: 'up', icon: Flame },
  { id: 2, name: 'Flooding', score: 78, trend: 'down', icon: Droplets },
  { id: 3, name: 'Hurricanes', score: 72, trend: 'up', icon: Wind },
  { id: 4, name: 'Power Outages', score: 65, trend: 'down', icon: Zap },
];

export const initiatives: DashboardInitiative[] = [
  {
    id: 1,
    name: 'Climate Risk Assessment',
    status: 'In Progress',
    progress: 75,
    dueDate: '2024-06-15',
    poc: 'John Doe',
    tasks: [
      {
        id: 1,
        name: 'Data Collection',
        progress: 100,
        status: 'Completed'
      },
      {
        id: 2,
        name: 'Analysis',
        progress: 60,
        status: 'In Progress'
      }
    ],
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
  { 
    id: 1,
    name: "Hurricane Sandy", 
    coordinates: [-74.006, 40.7128], 
    type: "hurricane",
    score: 85
  },
  { 
    id: 2,
    name: "Heat Wave", 
    coordinates: [2.3522, 48.8566], 
    type: "heatwave",
    score: 78
  },
  { 
    id: 3,
    name: "Drought", 
    coordinates: [138.2529, -34.9285], 
    type: "drought",
    score: 65
  },
];