/**
 * Formats a date string to a localized string
 * @param date - ISO date string
 * @returns Formatted date string
 */
export function formatDate(date: string): string {
  try {
    const dateObj = new Date(date);
    
    // Handle invalid dates
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date provided to formatDate:', date);
      return 'Invalid Date';
    }
    
    return dateObj.toLocaleString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
}

/**
 * Formats a date for display in a more readable format
 * @param date - ISO date string
 * @returns Formatted date string
 */
export function formatDateReadable(date: string): string {
  try {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    const now = new Date();
    const diffInHours = (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);
    
    // Show relative time for recent dates
    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const minutes = Math.floor(diffInHours * 60);
        return `${minutes} minutes ago`;
      }
      return `${Math.floor(diffInHours)} hours ago`;
    }
    
    return dateObj.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting readable date:', error);
    return 'Invalid Date';
  }
}

/**
 * Checks if a date is in the past
 * @param date - ISO date string
 * @returns boolean
 */
export function isPastDate(date: string): boolean {
  try {
    const dateObj = new Date(date);
    return dateObj < new Date();
  } catch {
    return false;
  }
}
  