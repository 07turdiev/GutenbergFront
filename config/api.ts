// Centralized API configuration
export const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://admin.gutenbergnu.uz';
};

export const getApiUrl = (): string => {
  const baseUrl = getApiBaseUrl();
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
};

// Helper function to ensure URL is absolute
export const ensureAbsoluteUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${getApiBaseUrl()}${url}`;
}; 
