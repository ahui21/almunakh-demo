import { parse } from 'csv-parse/sync';
import { logger } from '@/lib/utils/logger';
import type { RiskMetric } from '@/lib/types/dashboard';

export async function readCSV(filePath: string) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      logger.error('Failed to fetch CSV:', response.statusText);
      return [];
    }

    const fileContent = await response.text();
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    if (!records.length) {
      logger.warn('No records found in CSV');
      return [];
    }

    logger.info(`Successfully parsed ${records.length} records`);
    return records;
  } catch (error) {
    logger.error('Error reading CSV:', error);
    return [];
  }
} 