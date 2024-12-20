import { LucideIcon } from 'lucide-react';

export interface Location {
  id: number;
  name: string;
  score: number;
  trend: 'up' | 'down';
}

export interface Task {
  id: number;
  name: string;
  progress: number;
  status?: 'In Progress' | 'Completed' | 'Planning';
}

export interface SubInitiative {
  id: number;
  name: string;
  status: 'In Progress' | 'Completed' | 'Planning';
  progress: number;
  dueDate: string;
  poc: string;
}

export type MarkerType = 'Hurricane' | 'Drought' | 'Heat Wave';

export interface MapMarker {
  id: string;
  name: string;
  type: string;
  score: number;
  coordinates: [number, number];
  startDate: string;
  endDate: string;
  affectedAreas: string[];
}

export interface Initiative {
  id: number;
  name: string;
  status: 'In Progress' | 'Completed' | 'Planning';
  progress: number;
  dueDate: string;
  poc: string;
  subInitiatives?: SubInitiative[];
  tasks?: Task[];
}