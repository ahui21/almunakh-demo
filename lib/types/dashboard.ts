import { LucideIcon } from 'lucide-react';

export interface Location {
  id: number;
  name: string;
  score: number;
  trend: 'up' | 'down';
}

export interface Risk {
  id: number;
  name: string;
  score: number;
  trend: 'up' | 'down';
  icon: LucideIcon;
}

export interface Task {
  id: number;
  name: string;
  progress: number;
  status?: 'In Progress' | 'Completed' | 'Planning';
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
  id: number;
  name: string;
  coordinates: [number, number];
  type: MarkerType;
  score: number;
  startDate: string;
  endDate: string;
  affectedAreas: string[];
}

export type RiskMetric = 
  | 'World Risk Index'
  | 'Exposure'
  | 'Vulnerability'
  | 'Susceptibility'
  | 'Lack of Coping Capabilities'
  | 'Lack of Adaptive Capacities';

export interface CountryData {
  country: string;
  scores: Record<RiskMetric, number>;
  year: number;
}