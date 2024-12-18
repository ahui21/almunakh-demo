export interface RiskRegion {
  id: string;
  name: string;
  riskScore: number;
  geometry: GeoJSON.Polygon;
}

export interface Annotation {
  id: string;
  type: 'marker' | 'polygon' | 'line';
  coordinates: number[];
  description: string;
  createdBy: string;
  createdAt: Date;
} 