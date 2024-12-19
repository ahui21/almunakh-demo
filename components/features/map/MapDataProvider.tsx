import Map from './Map';
import type { MapMarker } from '@/lib/types/dashboard';
import { parse } from 'csv-parse/sync';
import type { CountryData } from '@/lib/types/dashboard';

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
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: ','
    });

    interface CountryNameMap {
      [key: string]: string;
    }

    const countryNameMap: CountryNameMap = {
      // Existing mappings
      'Philippinen': 'Philippines',
      'Salomonen': 'Solomon Islands',
      'Bangladesch': 'Bangladesh',
      'Kambodscha': 'Cambodia',
      'Timor-Leste': 'East Timor',
      'Costa Rica': 'Costa Rica',
      'Vanuatu': 'Vanuatu',
      'Tonga': 'Tonga',
      'Guatemala': 'Guatemala',
      'Madagaskar': 'Madagascar',
      'Brunei Darussalam': 'Brunei',
      'Dschibuti': 'Djibouti',
      'Fidschi': 'Fiji',
      'Kiribati': 'Kiribati',
      'Mauretanien': 'Mauritania',
      'Mosambik': 'Mozambique',
      'Niger': 'Niger',
      'Papua-Neuguinea': 'Papua New Guinea',
      'Sambia': 'Zambia',
      'Simbabwe': 'Zimbabwe',
      'Tschad': 'Chad',
      'Vereinigte Staaten': 'United States of America',
      'Großbritannien': 'United Kingdom',
      'Russische Föderation': 'Russia',
      'Südkorea': 'South Korea',
      'Nordkorea': 'North Korea',
      'Neuseeland': 'New Zealand',
      'Südafrika': 'South Africa',
      // Additional mappings
      'Ägypten': 'Egypt',
      'Äthiopien': 'Ethiopia',
      'Albanien': 'Albania',
      'Algerien': 'Algeria',
      'Armenien': 'Armenia',
      'Aserbaidschan': 'Azerbaijan',
      'Äquatorialguinea': 'Equatorial Guinea',
      'Bahamas': 'The Bahamas',
      'Belgien': 'Belgium',
      'Bosnien und Herzegowina': 'Bosnia and Herzegovina',
      'Brasilien': 'Brazil',
      'Bulgarien': 'Bulgaria',
      'Burkina Faso': 'Burkina Faso',
      'Chile': 'Chile',
      'China': 'China',
      'Dänemark': 'Denmark',
      'Deutschland': 'Germany',
      'Dominikanische Republik': 'Dominican Republic',
      'Ecuador': 'Ecuador',
      'Elfenbeinküste': "Côte d'Ivoire",
      'El Salvador': 'El Salvador',
      'Estland': 'Estonia',
      'Finnland': 'Finland',
      'Frankreich': 'France',
      'Georgien': 'Georgia',
      'Ghana': 'Ghana',
      'Griechenland': 'Greece',
      'Guinea': 'Guinea',
      'Haiti': 'Haiti',
      'Honduras': 'Honduras',
      'Indien': 'India',
      'Indonesien': 'Indonesia',
      'Irak': 'Iraq',
      'Iran': 'Iran',
      'Irland': 'Ireland',
      'Island': 'Iceland',
      'Israel': 'Israel',
      'Italien': 'Italy',
      'Jamaika': 'Jamaica',
      'Japan': 'Japan',
      'Jemen': 'Yemen',
      'Jordanien': 'Jordan',
      'Kanada': 'Canada',
      'Kasachstan': 'Kazakhstan',
      'Kenia': 'Kenya',
      'Kolumbien': 'Colombia',
      'Kroatien': 'Croatia',
      'Kuba': 'Cuba',
      'Kuwait': 'Kuwait',
      'Laos': 'Laos',
      'Lettland': 'Latvia',
      'Libanon': 'Lebanon',
      'Libyen': 'Libya',
      'Litauen': 'Lithuania',
      'Malaysia': 'Malaysia',
      'Marokko': 'Morocco',
      'Mexiko': 'Mexico',
      'Moldau': 'Moldova',
      'Mongolei': 'Mongolia',
      'Montenegro': 'Montenegro',
      'Myanmar': 'Myanmar',
      'Namibia': 'Namibia',
      'Nicaragua': 'Nicaragua',
      'Niederlande': 'Netherlands',
      'Nigeria': 'Nigeria',
      'Norwegen': 'Norway',
      'Österreich': 'Austria',
      'Pakistan': 'Pakistan',
      'Panama': 'Panama',
      'Paraguay': 'Paraguay',
      'Peru': 'Peru',
      'Polen': 'Poland',
      'Portugal': 'Portugal',
      'Rumänien': 'Romania',
      'Saudi-Arabien': 'Saudi Arabia',
      'Schweden': 'Sweden',
      'Schweiz': 'Switzerland',
      'Senegal': 'Senegal',
      'Serbien': 'Serbia',
      'Sierra Leone': 'Sierra Leone',
      'Slowakei': 'Slovakia',
      'Slowenien': 'Slovenia',
      'Somalia': 'Somalia',
      'Spanien': 'Spain',
      'Sri Lanka': 'Sri Lanka',
      'Sudan': 'Sudan',
      'Syrien': 'Syria',
      'Tansania': 'Tanzania',
      'Thailand': 'Thailand',
      'Tschechische Republik': 'Czech Republic',
      'Tunesien': 'Tunisia',
      'Türkei': 'Turkey',
      'Turkmenistan': 'Turkmenistan',
      'Uganda': 'Uganda',
      'Ukraine': 'Ukraine',
      'Ungarn': 'Hungary',
      'Uruguay': 'Uruguay',
      'Usbekistan': 'Uzbekistan',
      'Venezuela': 'Venezuela',
      'Vietnam': 'Vietnam'
    };

    // Data validation and transformation
    return records
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

  } catch (error: unknown) {
    console.error('Error processing CSV data:', 
      error instanceof Error ? error.message : 'Unknown error'
    );
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return [];
  } finally {
    // Log any unmapped countries at the end
    if (unmappedCountries.size > 0) {
      console.warn('Unmapped countries found:', Array.from(unmappedCountries));
    }
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