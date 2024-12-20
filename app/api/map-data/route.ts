import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import type { CountryData, RiskMetric } from '@/lib/types/dashboard';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public/data/world_risk_index.csv');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    const countryMap = new Map<string, CountryData>();

    records.forEach((row: any, index: number) => {
      try {
        const countryCode = row['ISO 3'];
        const year = parseInt(row['Year']);
        
        const data: CountryData = {
          id: countryCode,
          country: row['Country'],
          scores: {
            'World Risk Index': parseFloat(row['WorldRiskIndex']) * 100,
            'Natural Disasters': parseFloat(row['Exposure']) * 100,
            'Infrastructure': (1 - parseFloat(row['Vulnerability'])) * 100
          },
          year
        };

        const existing = countryMap.get(countryCode);
        if (!existing || existing.year < data.year) {
          countryMap.set(countryCode, data);
        }
      } catch (err) {
        console.warn(`Failed to process row ${index}:`, err);
      }
    });

    return NextResponse.json(Array.from(countryMap.values()));
  } catch (error) {
    console.error('Failed to load world risk data:', error);
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}