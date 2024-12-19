import { parse } from 'csv-parse';

export async function parseCSV(filePath: string) {
  try {
    const response = await fetch(filePath);
    const fileContent = await response.text();
    
    return new Promise((resolve, reject) => {
      parse(fileContent, {
        columns: true,
        skip_empty_lines: true
      }, (err, records) => {
        if (err) {
          console.error('Error parsing CSV:', err);
          resolve([]);
          return;
        }
        resolve(records.map((record: any) => ({
          country: record.country,
          score: Number(record.score)
        })));
      });
    });
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
} 