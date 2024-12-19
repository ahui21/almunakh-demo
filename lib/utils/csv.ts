import { parse } from 'csv-parse/sync';

export async function parseCSV(filePath: string) {
  try {
    const response = await fetch(filePath);
    const fileContent = await response.text();
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    return records.map((record: any) => ({
      country: record.country,
      score: Number(record.score)
    }));
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
} 