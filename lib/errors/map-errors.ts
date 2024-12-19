interface MapErrorDetails {
  status?: number;
  error?: unknown;
  received?: string;
  lastError?: string;
  lastErrorStack?: string;
  attempts?: number;
}

export class MapDataError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: MapErrorDetails
  ) {
    super(message);
    this.name = 'MapDataError';
  }
} 