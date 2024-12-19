import { NextResponse } from 'next/server';
import type { RiskMetric, CountryData } from '@/lib/types/dashboard';
import { promises as fs } from 'fs';
import path from 'path';
import { germanToEnglishCountries } from '@/lib/utils/country-translations';
import { logger } from '@/lib/utils/logger';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const metric = searchParams.get('metric') as RiskMetric;

    console.log('API Route - Received request for metric:', metric);

    if (!metric) {
      console.log('API Route - Missing metric parameter');
      return NextResponse.json(
        { error: 'Metric parameter is required' },
        { status: 400 }
      );
    }

    // Validate metric value
    const validMetrics = [
      'World Risk Index',
      'Exposure',
      'Vulnerability',
      'Susceptibility',
      'Lack of Coping Capabilities',
      'Lack of Adaptive Capacities'
    ];

    if (!validMetrics.includes(metric)) {
      console.log('API Route - Invalid metric:', metric);
      return NextResponse.json(
        { error: `Invalid metric. Must be one of: ${validMetrics.join(', ')}` },
        { status: 400 }
      );
    }

    // Read and process file
    try {
      const filePath = path.join(process.cwd(), 'public', 'data', 'world_risk_index.csv');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      
      // Parse CSV
      const lines = fileContent.split('\n').filter(line => line.trim().length > 0);
      const headers = lines[0].split(',').map(header => header.trim());
      const rows = lines.slice(1);

      console.log('API Route - Headers:', headers);
      console.log('API Route - Number of data rows:', rows.length);

      // Process data
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
        logger.error('API Route - Validation errors:', errors);
        return NextResponse.json(
          { error: 'Data validation failed', details: errors },
          { status: 400 }
        );
      }

      const result = Array.from(countryMap.values());
      logger.info('API Route - Successfully processed records:', result.length);
      
      return NextResponse.json(result);
    } catch (error) {
      if (error instanceof Error) {
        logger.error('API Route - Data processing error:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      } else {
        logger.error('API Route - Unknown error:', error);
      }
      return NextResponse.json(
        { 
          error: 'Failed to process data',
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error('API Route - Unexpected error:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    } else {
      logger.error('API Route - Unknown error:', error);
    }

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}