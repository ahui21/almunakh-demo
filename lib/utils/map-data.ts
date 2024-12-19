import { parse } from 'csv-parse/sync';
import type { RiskMetric, CountryData } from '@/lib/types/dashboard';

const unmappedCountries = new Set<string>();

interface CSVRecord {
  country: string;
  scores: {
    [key in RiskMetric]: number;
  };
  year: number;
}

type ProcessedRecord = {
  country: string;
  scores: {
    [key in RiskMetric]: number;
  };
  year: number;
} | null;

export async function processMapData(data: string[], selectedMetric: RiskMetric): Promise<CountryData[]> {
  try {
    const headers = data[0].split(',').map(header => header.trim());
    const rows = data.slice(1);

    return rows
      .map((row): ProcessedRecord => {
        try {
          const values = row.split(',').map(val => val.trim());
          const [
            country,
            wri, 
            exposure, 
            vulnerability, 
            susceptibility, 
            coping, 
            adaptation,
            year,
          ] = values;

          const scores = {
            'World Risk Index': parseFloat(wri),
            'Exposure': parseFloat(exposure),
            'Vulnerability': parseFloat(vulnerability),
            'Susceptibility': parseFloat(susceptibility),
            'Lack of Coping Capabilities': parseFloat(coping.replace(/\s+/g, '')),
            'Lack of Adaptive Capacities': parseFloat(adaptation),
          };

          // Validate scores
          Object.entries(scores).forEach(([field, score]) => {
            if (isNaN(score)) {
              throw new Error(`Invalid ${field} score: not a number (value: ${values[headers.indexOf(field)]})`);
            }
            if (score < 0 || score > 100) {
              throw new Error(`Invalid ${field} score: must be between 0 and 100 (value: ${score})`);
            }
          });

          const yearNum = parseInt(year);
          if (isNaN(yearNum)) {
            throw new Error(`Invalid year: not a number (value: ${year})`);
          }

          return {
            country,
            scores,
            year: yearNum
          };
        } catch (err) {
          console.warn('Failed to process row:', row, err);
          return null;
        }
      })
      .filter((record: ProcessedRecord): record is NonNullable<ProcessedRecord> => {
        return record !== null && !isNaN(record.scores[selectedMetric]);
      });
  } catch (error) {
    console.error('Error processing map data:', error);
    return [];
  }
} 