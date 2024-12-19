import type { CountryData } from '@/lib/types/dashboard';

interface CacheItem<T> {
  data: T;
  timestamp: number;
  metric: string;
}

class DataCache<T> {
  private cache: Map<string, CacheItem<T>> = new Map();
  private readonly ttl: number; // Time to live in milliseconds

  constructor(ttlMinutes: number = 5) {
    this.ttl = ttlMinutes * 60 * 1000;
  }

  set(key: string, data: T, metric: string): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      metric
    });
  }

  get(key: string, metric: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (item.metric !== metric) return null;
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }

  clear(): void {
    this.cache.clear();
  }
}

export const mapDataCache = new DataCache<CountryData[]>(5); // 5 minutes TTL 