// Remove CountryData import and any related code

// Update cache keys and types
const CACHE_KEYS = {
  MARKERS: 'markers',
  // Remove risk-related cache keys
} as const;

export type CacheKey = keyof typeof CACHE_KEYS;

export async function getFromCache<T>(key: CacheKey): Promise<T | null> {
  try {
    const cached = localStorage.getItem(CACHE_KEYS[key]);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
}

export async function setInCache<T>(key: CacheKey, data: T): Promise<void> {
  try {
    localStorage.setItem(CACHE_KEYS[key], JSON.stringify(data));
  } catch (error) {
    console.error(`Failed to cache ${key}:`, error);
  }
} 