import { DateTime } from 'luxon';

/**
 * Auto-detect user's browser timezone with fallback
 */
export function getBrowserTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz || 'America/New_York';
  } catch (e) {
    return 'America/New_York';
  }
}

/**
 * Format date for input or query: YYYY-MM-DD
 */
export function formatDateYMD(dateTimeObj) {
  return dateTimeObj.toFormat('yyyy-MM-dd');
}

/**
 * Format display date: e.g. "Saturday, Sep 26"
 */
export function formatDisplayDate(dateStr, zone = 'America/New_York') {
  return DateTime.fromISO(dateStr, { zone }).toFormat('EEEE, MMM dd');
}

/**
 * Generate next N days from today
 */
export function getNextDays(count = 7, zone = 'America/New_York') {
  const days = [];
  const start = DateTime.now().setZone(zone);
  for (let i = 0; i < count; i++) {
    const d = start.plus({ days: i });
    days.push({
      dateStr: d.toFormat('yyyy-MM-dd'),
      dayName: i === 0 ? 'Today' : (i === 1 ? 'Tomorrow' : d.toFormat('EEE')),
      dayNumber: d.toFormat('dd'),
      monthName: d.toFormat('MMM'),
      fullDate: d.toFormat('EEEE, MMMM dd, yyyy')
    });
  }
  return days;
}
