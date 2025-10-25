/**
 * Test utilities and helpers
 */

/**
 * Creates a test URL for API route testing
 * Uses a generic test domain since we're testing handlers directly, not making HTTP calls
 */
export const getTestApiUrl = (path: string): string => {
  const baseUrl = process.env.TEST_API_BASE_URL || 'http://test.local';
  return `${baseUrl}${path}`;
};
