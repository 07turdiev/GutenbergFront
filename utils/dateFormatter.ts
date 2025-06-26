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

/**
 * Formats a date string for blog posts with proper locale support
 * @param dateString - Date string from API (e.g., "2025-06-27")
 * @param locale - Locale string ('uz' or 'ru')
 * @returns Formatted date string (e.g., "27 iyun 2024")
 */
export const formatBlogDate = (dateString: string, locale: string = 'uz'): string => {
    if (!dateString) return '';
    
    let date = new Date(dateString);
    const now = new Date();
    
    // If the date is in the future, it might be a data entry error
    // Common issue: year 2025 might be meant as 2024
    if (date > now) {
        const yearDiff = date.getFullYear() - now.getFullYear();
        if (yearDiff > 0) {
            // Adjust the year to current year
            date.setFullYear(now.getFullYear());
        }
    }
    
    // Special handling for Uzbek locale
    if (locale === 'uz' || locale === 'uz-UZ') {
        const months = [
            'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
            'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'
        ];
        
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        
        return `${day} ${months[monthIndex]} ${year}`;
    }
    
    // For other locales, use standard formatting
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    
    return date.toLocaleDateString(locale, options);
};

/**
 * Formats a date as relative time (e.g., "2 kun oldin")
 * @param dateString - Date string from API
 * @param locale - Locale string ('uz' or 'ru')
 * @returns Relative time string
 */
export const formatRelativeTime = (dateString: string, locale: string = 'uz'): string => {
    if (!dateString) return '';
    
    let date = new Date(dateString);
    const now = new Date();
    
    // Fix future dates
    if (date > now) {
        const yearDiff = date.getFullYear() - now.getFullYear();
        if (yearDiff > 0) {
            date.setFullYear(now.getFullYear());
        }
    }
    
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
        return locale === 'uz' ? 'hozirgina' : 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return locale === 'uz' 
            ? `${diffInMinutes} daqiqa oldin` 
            : `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return locale === 'uz'
            ? `${diffInHours} soat oldin`
            : `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return locale === 'uz'
            ? `${diffInDays} kun oldin`
            : `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
        return locale === 'uz'
            ? `${diffInMonths} oy oldin`
            : `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return locale === 'uz'
        ? `${diffInYears} yil oldin`
        : `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}; 