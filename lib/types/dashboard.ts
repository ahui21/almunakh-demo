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
  level: 'High' | 'Medium' | 'Low';
  impact: number;
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

export interface MapMarker {
  id: number;
  name: string;
  lat: number;
  lng: number;
  score: number;
}