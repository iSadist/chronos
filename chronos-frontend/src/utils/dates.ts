// Date Utilities

/**
 * Turn a date into a string using the date's time zone
 * @param date The date to turn into a string
 * @returns The date as a string
 */
export function turnDateIntoString(date: Date) {
    return date.toISOString().split('T')[0]
}

/**
 * Get the first day of the month. Will return the first day of the month at 12:00 to avoid time zone issues
 * @param date The date to get the first day of the month for
 * @returns The first day of the month
 */
export function getStartOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1, 12)
}

/**
 * Get the last day of the month. Will return the first day of the month at 12:00 to avoid time zone issues
 * @param date The date to get the last day of the month for
 * @returns The last day of the month
 */
export function getEndOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 12)
}
