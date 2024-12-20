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
  description: string;
  status: 'In Progress' | 'Completed' | 'Planning';
  progress: number;
  dueDate: string;
  location: string;
  risk: string;
  subInitiatives: SubInitiative[];
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

export type RiskMetric = 'World Risk Index' | 'Natural Disasters' | 'Infrastructure';

export type TrendDirection = 'up' | 'down' | 'stable';

export interface CountryData {
  id: string;
  country: string;
  scores: {
    [key in RiskMetric]?: number;
  };
  year: number;
}

export interface WorldRiskData {
  id: string;
  name: string;
  value: number;
  trend: TrendDirection;
  lastUpdated: string;
}