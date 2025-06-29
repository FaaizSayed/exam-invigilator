export const format = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export function formatDateReadable(date: string): string {
  try {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    
    const now = new Date();
    const diffInHours = (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60);
    
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

export function isPastDate(date: string): boolean {
  try {
    const dateObj = new Date(date);
    return dateObj < new Date();
  } catch {
    return false;
  }
}
  