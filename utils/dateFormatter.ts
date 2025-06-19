/**
 * Formats an ISO date string to the format: YYYY.MM.DD HH:mm
 * @param dateString - ISO date string (e.g., "2025-06-19T11:01:14.416Z")
 * @returns Formatted date string (e.g., "2025.06.19 11:01")
 */
export const formatPublishedDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Get date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // Return formatted string
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || '';
  }
}

/**
 * Formats an ISO date string to a localized format based on locale
 * @param dateString - ISO date string
 * @param locale - Locale string ('uz' or 'ru')
 * @returns Formatted date string
 */
export const formatPublishedDateLocalized = (dateString: string | undefined, locale: string = 'uz'): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Get date components
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    // Return formatted string
    return `${year}.${month}.${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString || '';
  }
} 