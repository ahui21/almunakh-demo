'use client'

import { mapDataCache } from '@/lib/utils/cache';
import type { CountryData, RiskMetric } from '@/lib/types/dashboard';
import { MapDataError } from '@/lib/errors/map-errors';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface MapDataErrorDetails {
  status?: number;
  error?: unknown;
  lastError?: string;
  lastErrorStack?: string;
  attempts?: number;
}

export async function fetchMapData(metric: RiskMetric): Promise<CountryData[]> {
  try {
    // Check cache first
    const cachedData = mapDataCache.get('worldRiskData', metric);
    if (cachedData) {
      return cachedData;
    }

    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(`/api/map-data?metric=${encodeURIComponent(metric)}`);
        
        if (!response.ok) {
          const error = await response.json();
          throw new MapDataError(
            'API request failed',
            'API_ERROR',
            { status: response.status, error }
          );
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new MapDataError(
            'Invalid data format received',
            'INVALID_FORMAT',
            { received: typeof data }
          );
        }

        if (data.length === 0) {
          throw new MapDataError(
            'No data received',
            'EMPTY_DATA'
          );
        }

        mapDataCache.set('worldRiskData', data, metric);
        return data;

      } catch (error: unknown) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Attempt ${attempt} failed:`, error);
        
        if (error instanceof MapDataError) {
          throw error;
        }

        if (attempt < MAX_RETRIES) {
          await delay(RETRY_DELAY * attempt);
          continue;
        }
      }
    }

    throw new MapDataError(
      'Failed to load map data after multiple attempts',
      'MAX_RETRIES_EXCEEDED',
      { 
        lastError: lastError?.message,
        lastErrorStack: lastError?.stack,
        attempts: MAX_RETRIES 
      }
    );
  } catch (error: unknown) {
    console.error('Top-level error in fetchMapData:', error);
    throw error;
  }
} 