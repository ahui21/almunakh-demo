import Map from './Map';
import type { MapMarker, CountryData } from '@/lib/types/dashboard';
import { parse } from 'csv-parse';
import { countryNameMap } from '@/lib/utils/country-translations';

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
    return new Promise<CountryData[]>((resolve, reject) => {
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

        const processedRecords = records
          .map((record: CSVRecord) => {
            // Basic validation
            if (!record.Region || !record.WRI) {
              console.warn('Invalid record found:', record);
              return null;
            }

            // Parse and validate WRI score
            const score = Number(record.WRI);
            if (isNaN(score) || score < 0 || score > 100) {
              console.warn('Invalid WRI score:', record);
              return null;
            }

            // Map country names and handle special cases
            const countryName = countryNameMap[record.Region] || record.Region;
            
            // Track unmapped countries
            if (!countryNameMap[record.Region]) {
              unmappedCountries.add(record.Region);
            }

            // Additional validation for country names
            if (countryName.length < 2) {
              console.warn('Invalid country name:', record);
              return null;
            }

            return {
              country: countryName,
              scores: {
                'World Risk Index': score,
                'Exposure': Number(record.Exposure) || 0,
                'Vulnerability': Number(record.Vulnerability) || 0
              },
              year: Number(record.Year) || new Date().getFullYear()
            };
          })
          .filter((record): record is NonNullable<typeof record> => {
            return record !== null && !isNaN(record.scores['World Risk Index']);
          });

        resolve(processedRecords);
      });
    });
  } catch (error) {
    console.error('Error processing CSV data:', error);
    return [];
  }
}

interface MapDataProviderProps { 
  markers: MapMarker[];
  className?: string;
}

export async function MapDataProvider({ markers, className }: MapDataProviderProps) {
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