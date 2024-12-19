import { parse } from 'csv-parse/sync';
import type { RiskMetric, CountryData } from '@/lib/types/dashboard';

const unmappedCountries = new Set<string>();

interface CSVRecord {
  Region: string;
  WRI: string;
  Exposure: string;
  Vulnerability: string;
  year?: string;
  [key: string]: string | undefined;
}

export async function getData(selectedMetric: RiskMetric = 'World Risk Index'): Promise<CountryData[]> {
  try {
    const response = await fetch('/data/world_risk_index.csv');
    if (!response.ok) {
      console.error('Failed to fetch CSV:', response.statusText);
      return [];
    }

    const fileContent = await response.text();
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: ','
    });

    const countryNameMap: { [key: string]: string } = {
      // ... existing country mappings ...
    };

    return records
      .map((record: CSVRecord) => {
        if (!record.Region) {
          console.warn('Invalid record found:', record);
          return null;
        }

        const score = Number(record[selectedMetric]);
        if (isNaN(score) || score < 0 || score > 100) {
          console.warn('Invalid score:', record);
          return null;
        }

        const countryName = countryNameMap[record.Region] || record.Region;
        
        if (!countryNameMap[record.Region]) {
          unmappedCountries.add(record.Region);
        }

        return {
          country: countryName,
          scores: {
            [selectedMetric]: score
          },
          year: Number(record.year) || new Date().getFullYear()
        };
      })
      .filter((record): record is NonNullable<typeof record> => {
        return record !== null && !isNaN(record.scores[selectedMetric]);
      });

  } catch (error) {
    console.error('Error processing CSV data:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return [];
  } finally {
    if (unmappedCountries.size > 0) {
      console.warn('Unmapped countries found:', Array.from(unmappedCountries));
    }
  }
} 