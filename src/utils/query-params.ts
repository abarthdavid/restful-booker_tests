/**
 * Converts an optional filter object to query parameters by removing undefined and empty values.
 * Useful for building optional query strings for API requests.
 *
 * @param filter - The optional filter object with string values.
 * @returns An object with string keys and values, or undefined if no valid params exist.
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
