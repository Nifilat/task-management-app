/**
 * Utility functions for handling dates in the application
 * Converts between ISO strings (stored in Redux) and Date objects (used in components)
 */

/**
 * Convert ISO string to Date object
 */
export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

/**
 * Convert Date object to ISO string
 */
export const serializeDate = (date: Date): string => {
  return date.toISOString();
};

/**
 * Get ordinal suffix for a day (1st, 2nd, 3rd, etc.)
 */
const getOrdinalSuffix = (day: number): string => {
  if (day >= 11 && day <= 13) return 'th';

  const lastDigit = day % 10;
  switch (lastDigit) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

/**
 * Format a Date object in custom format (e.g., "1st January 2024")
 */
export const formatDate = (date: Date): string => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
};

/**
 * Format a date string in custom format (e.g., "1st January 2024")
 */
export const formatDateString = (dateString: string): string => {
  const date = parseDate(dateString);
  return formatDate(date);
};

/**
 * Format a date string for display using browser locale
 */
export const formatDateLocale = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = parseDate(dateString);
  return date.toLocaleDateString(undefined, options);
};

/**
 * Format a date string for display with time
 */
export const formatDateTime = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = parseDate(dateString);
  return date.toLocaleString(undefined, options);
};

/**
 * Format a date string in custom format with time (e.g., "1st January 2024 at 2:30 PM")
 */
export const formatDateTimeCustom = (dateString: string): string => {
  const date = parseDate(dateString);
  const dateStr = formatDate(date);
  const timeStr = date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${dateStr} at ${timeStr}`;
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (dateString: string): string => {
  const date = parseDate(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMonths > 0) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  } else if (diffInWeeks > 0) {
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

/**
 * Check if a date string is valid
 */
export const isValidDate = (dateString: string): boolean => {
  return !isNaN(Date.parse(dateString));
};

/**
 * Get the current date as an ISO string
 */
export const getCurrentDateString = (): string => {
  return new Date().toISOString();
};

/**
 * Format updated date with fallback to created date
 */
export const formatTaskDate = (createdAt: string, updatedAt?: string): string => {
  const dateToFormat = updatedAt || createdAt;
  return formatDateString(dateToFormat);
};

/**
 * Get the most recent date between created and updated
 */
export const getLatestTaskDate = (createdAt: string, updatedAt?: string): string => {
  if (!updatedAt) return createdAt;

  const created = parseDate(createdAt);
  const updated = parseDate(updatedAt);

  return updated > created ? updatedAt : createdAt;
};

/**
 * Check if a date is today
 */
export const isToday = (dateString: string): boolean => {
  const date = parseDate(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Check if a date is yesterday
 */
export const isYesterday = (dateString: string): boolean => {
  const date = parseDate(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

/**
 * Smart date formatter that shows different formats based on recency
 */
export const formatDateSmart = (dateString: string): string => {
  if (isToday(dateString)) {
    const date = parseDate(dateString);
    return `Today at ${date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;
  } else if (isYesterday(dateString)) {
    const date = parseDate(dateString);
    return `Yesterday at ${date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })}`;
  } else {
    return formatDateString(dateString);
  }
};
