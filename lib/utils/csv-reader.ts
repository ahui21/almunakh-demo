import { promises as fs } from 'fs';
import path from 'path';
import type { CountryData, RiskMetric } from '@/lib/types/dashboard';
import { germanToEnglishCountries } from './country-translations';

export async function readCSVFile(metric: RiskMetric): Promise<CountryData[]> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'world_risk_index.csv');
    console.log('CSV Reader - Reading file from:', filePath);

    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    // First, let's parse and clean up the headers
    const lines = fileContent.split('\n').filter(line => line.trim().length > 0);
    const headers = lines[0].split(',').map(header => header.trim());
    const rows = lines.slice(1);

    console.log('CSV Reader - Headers:', headers);
    console.log('CSV Reader - Number of data rows:', rows.length);

    const countryMap = new Map<string, CountryData>();
    const errors: Array<{ row: number; error: string }> = [];

    rows.forEach((row, index) => {
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

        // Clean up any extra spaces in the values
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

        const countryCode = germanToEnglishCountries[country] || country;
        const data = {
          country: countryCode,
          scores,
          year: yearNum
        };

        const existing = countryMap.get(countryCode);
        if (!existing || existing.year < data.year) {
          countryMap.set(countryCode, data);
        }
      } catch (err) {
        errors.push({ 
          row: index + 2, 
          error: err instanceof Error ? err.message : String(err)
        });
      }
    });

    if (errors.length > 0) {
      console.error('CSV Reader - Validation errors:', errors);
      throw new Error(`CSV validation failed with ${errors.length} errors`);
    }

    const result = Array.from(countryMap.values());
    console.log('CSV Reader - Successfully processed records:', result.length);
    return result;

  } catch (error) {
    console.error('CSV Reader - Error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
} 