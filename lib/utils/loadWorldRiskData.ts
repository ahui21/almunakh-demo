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

const columnMap = {
  'World Risk Index': 1,
  'Exposure': 2,
  'Vulnerability': 3,
  'Susceptibility': 4,
  'Lack of Coping Capabilities': 5,
  'Lack of Adaptive Capacities': 6
} as const;

export async function loadWorldRiskData(): Promise<WorldRiskData[]> {
  try {
    const response = await fetch('/data/world_risk_index_cleaned.csv');
    if (!response.ok) {
      throw new Error('Failed to fetch CSV data');
    }
    const text = await response.text();
    
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ',',
    });

    return records.map((record: any) => {
      // Validate required fields
      const required = ['Region', 'WRI', 'Exposure', 'Vulnerability', 'Susceptibility'];
      for (const field of required) {
        if (!(field in record)) {
          throw new Error(`Missing required field: ${field}`);
        }
      }
      return {
        country: record.Region,
        'World Risk Index': Number(record.WRI) || 0,
        'Exposure': Number(record.Exposure) || 0,
        'Vulnerability': Number(record.Vulnerability) || 0,
        'Susceptibility': Number(record.Susceptibility) || 0,
        'Lack of Coping Capabilities': Number(record['Lack of Coping Capabilities']) || 0,
        'Lack of Adaptive Capacities': Number(record['Lack of Adaptive Capacities']) || 0
      };
    });
  } catch (error) {
    console.error('Error loading world risk data:', error);
    return [];
  }
}

export function getColumnForMetric(metric: string): number {
  return columnMap[metric as keyof typeof columnMap] || 1;
} 