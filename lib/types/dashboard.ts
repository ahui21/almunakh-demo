import { LucideIcon } from 'lucide-react';

export interface Location {
  name: string;
  score: number;
  trend: 'up' | 'down';
}

export interface Risk {
  name: string;
  score: number;
  icon: LucideIcon;
  trend?: 'up' | 'down';
}

export interface Task {
  id: number;
  name: string;
  progress: number;
}

export interface Initiative {
  id: number;
  name: string;
  status: 'In Progress' | 'Planning' | 'Completed';
  progress: number;
  dueDate: string;
  tasks?: Task[];
}

export interface MapMarker {
  name: string;
  coordinates: [number, number];
  type: 'hurricane' | 'heatwave' | 'drought';
}