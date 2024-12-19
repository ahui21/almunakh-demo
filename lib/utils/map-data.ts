import type { RiskMetric, CountryData } from '@/lib/types/dashboard';
import { logger } from './logger';

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

class MapDataError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'MapDataError';
  }
}

export async function processMapData(
  data: string[], 
  selectedMetric: RiskMetric
): Promise<CountryData[]> {
  try {
    if (!data || data.length === 0) {
      throw new MapDataError('No data provided', 'NO_DATA');
    }

    const headers = data[0].split(',').map(header => header.trim());
    const rows = data.slice(1);

    if (!headers.includes(selectedMetric)) {
      throw new MapDataError(
        `Invalid metric: ${selectedMetric}`, 
        'INVALID_METRIC',
        { availableMetrics: headers }
      );
    }

    const processedRecords = rows
      .map((row, index): ProcessedRecord => {
        try {
          const values = row.split(',').map(val => val.trim());
          if (values.length !== headers.length) {
            logger.warn(`Row ${index + 1} has incorrect number of columns`);
            return null;
          }

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
              throw new Error(`Invalid ${field} score: not a number`);
            }
            if (score < 0 || score > 100) {
              throw new Error(`Invalid ${field} score: must be between 0 and 100`);
            }
          });

          const yearNum = parseInt(year);
          if (isNaN(yearNum)) {
            throw new Error(`Invalid year: not a number`);
          }

          return {
            country,
            scores,
            year: yearNum
          };
        } catch (err) {
          logger.warn(`Failed to process row ${index + 1}:`, err);
          return null;
        }
      })
      .filter((record: ProcessedRecord): record is NonNullable<ProcessedRecord> => {
        return record !== null && !isNaN(record.scores[selectedMetric]);
      });

    if (processedRecords.length === 0) {
      throw new MapDataError(
        'No valid records found after processing',
        'NO_VALID_RECORDS'
      );
    }

    return processedRecords;
  } catch (error) {
    if (error instanceof MapDataError) {
      throw error;
    }
    logger.error('Error processing map data:', error);
    throw new MapDataError(
      'Failed to process map data',
      'PROCESSING_ERROR',
      error
    );
  }
} 