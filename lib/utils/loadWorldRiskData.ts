import { parse } from 'csv-parse/sync';

export interface WorldRiskData {
  country: string;
  'World Risk Index': number;
  Exposure: number;
  Vulnerability: number;
  Susceptibility: number;
  'Lack of Coping Capabilities': number;
  'Lack of Adaptive Capacities': number;
}

export async function loadWorldRiskData(): Promise<WorldRiskData[]> {
  try {
    const response = await fetch('/data/world_risk_index_cleaned.csv');
    const text = await response.text();
    
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ',',
    });

    return records.map((record: any) => ({
      country: record.Region,
      'World Risk Index': Number(record.WRI),
      'Exposure': Number(record.Exposure),
      'Vulnerability': Number(record.Vulnerability),
      'Susceptibility': Number(record.Susceptibility),
      'Lack of Coping Capabilities': Number(record['Lack of Coping Capabilities']),
      'Lack of Adaptive Capacities': Number(record['Lack of Adaptive Capacities'])
    }));
  } catch (error) {
    console.error('Error loading world risk data:', error);
    return [];
  }
}

export function getColumnForMetric(metric: string): number {
  return columnMap[metric as keyof typeof columnMap] || 1;
} 