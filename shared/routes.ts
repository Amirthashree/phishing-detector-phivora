import { z } from 'zod';
import { scanRequestSchema, scanResponseSchema, historyResponseSchema } from './schema';

export const api = {
  scan: {
    method: 'POST' as const,
    path: '/scan/' as const,
    input: scanRequestSchema,
    responses: {
      200: scanResponseSchema
    }
  },
  history: {
    method: 'GET' as const,
    path: '/history/' as const,
    responses: {
      200: historyResponseSchema
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
