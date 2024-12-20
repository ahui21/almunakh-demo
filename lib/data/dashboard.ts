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
  { id: 1, name: 'MIA Maintenance', score: 78, trend: 'down' },
  { id: 2, name: 'LAX Operations', score: 62, trend: 'up' },
  { id: 3, name: 'ORD Headquarters', score: 37, trend: 'up' },
  { id: 4, name: 'JFK Flight Hub', score: 15, trend: 'up' },
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
    name: 'JFK - Hurricane Sandy',
    status: 'In Progress',
    progress: 75,
    dueDate: '2024-08-29',
    poc: 'John Doe',
    subInitiatives: [
      {
        id: 1,
        name: 'Scheduling Adjustments',
        status: 'Completed',
        progress: 100,
        dueDate: '2024-08-27',
        poc: 'Sarah Smith'
      },
      {
        id: 2,
        name: 'Aircraft Relocation',
        status: 'In Progress',
        progress: 60,
        dueDate: '2024-08-28',
        poc: 'Mike Johnson'
      },
      {
        id: 3,
        name: 'Passenger Notifications',
        status: 'Planning',
        progress: 20,
        dueDate: '2024-08-29',
        poc: 'Emily Brown'
      }
    ]
  },
  {
    id: 2,
    name: 'FCO - Heat Wave',
    status: 'Planning',
    progress: 25,
    dueDate: '2024-08-31',
    poc: 'Luca Rossi',
    subInitiatives: [
      {
        id: 1,
        name: 'Workforce Shift Changes',
        status: 'Completed',
        progress: 100,
        dueDate: '2024-08-22',
        poc: 'Giulia Bianch'
      },
      {
        id: 2,
        name: 'Runway Maintenance',
        status: 'In Progress',
        progress: 30,
        dueDate: '2024-08-28',
        poc: 'Marco Ferri'
      },
      {
        id: 3,
        name: 'Cooling / Water Stations',
        status: 'Planning',
        progress: 10,
        dueDate: '2024-08-29',
        poc: 'Luigi Romano'
      }
    ]
  },
  {
    id: 3,
    name: 'SYD - Drought',
    status: 'Completed',
    progress: 100,
    dueDate: '2024-07-03',
    poc: 'Bob Smith',
    subInitiatives: [
      {
        id: 1,
        name: 'Water Usage Inventory',
        status: 'Completed',
        progress: 100,
        dueDate: '2024-07-01',
        poc: 'Jack Williams'
      },
      {
        id: 2,
        name: 'HVAC System Updates',
        status: 'Completed',
        progress: 100,
        dueDate: '2024-07-02',
        poc: 'Liam Brown'
      },
      {
        id: 3,
        name: 'Shift Wash Schedules',
        status: 'Completed',
        progress: 100,
        dueDate: '2024-07-07',
        poc: 'Olivia Johnson'
      }
    ]
  },
];

export const mapMarkers: MapMarker[] = [
  {
    id: '1',
    name: 'Sandy',
    type: 'Hurricane',
    score: 85,
    coordinates: [-74.006, 40.7128],
    startDate: '2024-08-26',
    endDate: '2024-08-28',
    affectedAreas: [
      'JFK Flight Hub',
      'JFK Operations',
      'LGA Maintenance'
    ]
  },
  { 
    id: '2',
    name: 'Heat Wave',
    type: 'Heat Wave',
    score: 42,
    coordinates: [12.4964, 41.9028],
    startDate: '2024-08-29',
    endDate: '2024-08-31',
    affectedAreas: [
      'FCO Flight Hub',
      'FCO Maintenance'
    ]
  },
  { 
    id: '3',
    name: 'Drought',
    type: 'Drought',
    score: 20,
    coordinates: [151.2093, -33.8688],
    startDate: '2024-08-20',
    endDate: '2024-08-22',
    affectedAreas: [
      'SYD Maintenance',
      'SYD Operations'
    ]
  }
];