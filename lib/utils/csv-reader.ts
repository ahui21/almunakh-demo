import { parse } from 'csv-parse';
import { logger } from '@/lib/utils/logger';

export async function readCSV(filePath: string) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      logger.error('Failed to fetch CSV:', response.statusText);
      return [];
    }

    const fileContent = await response.text();
    return new Promise((resolve, reject) => {
      parse(fileContent, {
        columns: true,
        skip_empty_lines: true
      }, (err, records) => {
        if (err) {
          logger.error('Failed to parse CSV:', err);
          resolve([]);
        }
        
        if (!records.length) {
          logger.warn('No records found in CSV');
          resolve([]);
        }

        logger.info(`Successfully parsed ${records.length} records`);
        resolve(records);
      });
    });
  } catch (error) {
    logger.error('Error reading CSV:', error);
    return [];
  }
} 