import { randomUUID } from 'node:crypto';

/**
 * Collision-safe id for parallel workers / shards / retries.
 * Prefer UUID over Date.now()+Math.random (same-ms collisions under load).
 */
export function uniqueSuffix(): string {
  const worker = process.env.TEST_PARALLEL_INDEX ?? String(process.pid);
  const uuid = randomUUID().replace(/-/g, '');
  return `${worker}_${uuid}`;
}

/** Short token safe for emails / passwords (alnum only). */
export function uniqueToken(length = 12): string {
  return uniqueSuffix().replace(/_/g, '').slice(0, length);
}
