/**
 * Converts an optional filter object to query params by removing undefined/empty values.
 */
export function toQueryParams<T extends object>(filter?: T): Record<string, string> | undefined {
  if (!filter) return undefined;

  const params: Record<string, string> = {};

  for (const [key, value] of Object.entries(filter)) {
    if (typeof value === 'string' && value !== '') {
      params[key] = value;
    }
  }

  return Object.keys(params).length > 0 ? params : undefined;
}
