import { DateTime } from 'luxon';

/**
 * Standard supported time zones for Codeyoung global parents & mentors.
 * Covers US (Eastern, Central, Mountain, Pacific), UK (London), India (IST), Canada, Australia, etc.
 */
export const SUPPORTED_TIMEZONES = [
  {
    id: 'America/New_York',
    label: 'US Eastern Time (New York / EDT / EST)',
    country: 'United States',
    group: 'US & Canada',
    defaultCity: 'New York'
  },
  {
    id: 'America/Chicago',
    label: 'US Central Time (Chicago / CDT / CST)',
    country: 'United States',
    group: 'US & Canada',
    defaultCity: 'Chicago'
  },
  {
    id: 'America/Denver',
    label: 'US Mountain Time (Denver / MDT / MST)',
    country: 'United States',
    group: 'US & Canada',
    defaultCity: 'Denver'
  },
  {
    id: 'America/Los_Angeles',
    label: 'US Pacific Time (San Francisco / PDT / PST)',
    country: 'United States',
    group: 'US & Canada',
    defaultCity: 'San Francisco'
  },
  {
    id: 'America/Toronto',
    label: 'Canada Eastern Time (Toronto)',
    country: 'Canada',
    group: 'US & Canada',
    defaultCity: 'Toronto'
  },
  {
    id: 'Europe/London',
    label: 'UK Time (London / BST / GMT)',
    country: 'United Kingdom',
    group: 'Europe',
    defaultCity: 'London'
  },
  {
    id: 'Asia/Kolkata',
    label: 'India Standard Time (IST - Asia/Kolkata)',
    country: 'India',
    group: 'Asia',
    defaultCity: 'Bengaluru / New Delhi'
  },
  {
    id: 'Asia/Dubai',
    label: 'Gulf Standard Time (GST - Dubai)',
    country: 'UAE',
    group: 'Middle East',
    defaultCity: 'Dubai'
  },
  {
    id: 'Australia/Sydney',
    label: 'Australian Eastern Time (Sydney / AEST / AEDT)',
    country: 'Australia',
    group: 'Oceania',
    defaultCity: 'Sydney'
  }
];

export const MENTOR_DEFAULT_TIMEZONE = 'Asia/Kolkata';

/**
 * Extracts rich timezone & DST metadata for a given zone and reference date.
 * Explains whether Daylight Savings Time is currently in effect and the current UTC offset.
 */
export function getTimezoneMeta(zoneId, dateIso = null) {
  try {
    const dt = dateIso ? DateTime.fromISO(dateIso, { zone: zoneId }) : DateTime.now().setZone(zoneId);
    
    // Check if DST is active: luxon dt.isInDST
    const isInDST = dt.isInDST;
    const offsetNameLong = dt.offsetNameLong;
    const offsetNameShort = dt.offsetNameShort;
    const formattedOffset = dt.toFormat('ZZ'); // e.g. -04:00, +05:30
    
    // Description explaining DST impact
    let dstExplanation = '';
    if (zoneId === 'Asia/Kolkata') {
      dstExplanation = 'India (IST) operates on fixed UTC+05:30 year-round with no Daylight Saving Time adjustments.';
    } else if (isInDST) {
      dstExplanation = `Daylight Saving Time is currently ACTIVE (${offsetNameShort}). Clocks are 1 hour forward.`;
    } else {
      dstExplanation = `Standard Time is currently active (${offsetNameShort}). No Daylight Saving offset applied.`;
    }

    return {
      zoneId,
      isInDST,
      offsetNameLong,
      offsetNameShort,
      formattedOffset,
      currentLocalTime: dt.toFormat('hh:mm a'),
      currentLocalDate: dt.toFormat('yyyy-MM-dd'),
      dstExplanation
    };
  } catch (err) {
    return {
      zoneId,
      isInDST: false,
      offsetNameLong: 'Unknown',
      offsetNameShort: 'UTC',
      formattedOffset: '+00:00',
      dstExplanation: 'Standard UTC'
    };
  }
}
