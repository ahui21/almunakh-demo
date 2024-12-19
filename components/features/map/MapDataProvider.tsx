import Map from './Map';
import type { MapMarker, CountryData } from '@/lib/types/dashboard';
import { parse } from 'csv-parse';

// Add console logging to track problematic records
const unmappedCountries = new Set<string>();

interface CSVRecord {
  Region: string;
  WRI: string;
  Exposure: string;
  Vulnerability: string;
  Year?: string;
}

async function getData(): Promise<CountryData[]> {
  try {
    const response = await fetch('/data/world_risk_index.csv');
    if (!response.ok) {
      console.error('Failed to fetch CSV:', response.statusText);
      return [];
    }

    const fileContent = await response.text();
    return new Promise((resolve, reject) => {
      parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        delimiter: ','
      }, (err, records) => {
        if (err) {
          console.error('Failed to parse CSV:', err);
          resolve([]);
          return;
        }
        // Rest of your data processing...
        const processedRecords = records
          .map((record: CSVRecord) => {
            // Your existing mapping logic
          })
          .filter((record): record is NonNullable<typeof record> => {
            return record !== null && !isNaN(record.scores['World Risk Index']);
          });
        resolve(processedRecords);
      });
    });
  } catch (error) {
    // ... error handling ...
  }
}

interface MapDataProviderProps { 
  markers: MapMarker[];
  className?: string;
}

interface MapDataError {
  message: string;
  code?: string;
}

export async function MapDataProvider({ 
  markers,
  className 
}: MapDataProviderProps) {
  try {
    const countryRisks = await getData();
    return (
      <Map 
        markers={markers} 
        countryRisks={countryRisks}
        className={className}
      />
    );
  } catch (error) {
    console.error('Failed to load map data:', error);
    return (
      <div className="text-red-500">
        Failed to load map data. Please try again later.
      </div>
    );
  }
} 