/**
 * ===========================================================================
 *  THE INSTANT OF A BIRTH
 * ===========================================================================
 *
 * A chart is only ever about one moment, and getting that moment wrong makes
 * every other number in the system wrong in a way nobody can see: the Moon
 * moves 13.2 degrees a day, so an hour out is half a degree, which is a sixth
 * of a nakshatra.
 *
 * ── Why not new Date() ─────────────────────────────────────────────────────
 *
 * Because a Date carries a timezone, and this calculation must not have one. The
 * moon does not care which city somebody is in. A local-midnight Date would
 * shift every chart by the difference between the machine's offset and the
 * birth city's, which for India is a half hour and is enough to move a pada.
 *
 * So the arithmetic is done here, in plain numbers, and the timezone is applied
 * once and on purpose.
 */

/**
 * The offset from UTC, in hours, for Indian Standard Time.
 *
 * India has run on a single offset of +5:30 since 1945 and does not observe
 * daylight saving, so there is one number rather than a table. Dates before 1945
 * are rare enough on this site that using the current rule for them is a fair
 * simplification, and it is noted here rather than pretended away.
 */
export const INDIA_UTC_OFFSET = 5.5;

/**
 * Julian day from calendar parts, in local time.
 *
 * The standard formula, which is exact for the Gregorian calendar and needs no
 * lookup table and no Date object.
 *
 * The month is made 1-based so January and February count as months 13 and 14
 * of the year before, which is what puts the leap day at the end of the year
 * where it belongs. Taking the month as given and adding a year whenever it was
 * January or February is the classic off-by-one: every birth in those two
 * months came out one year wrong before it was spotted.
 */
export function julianDayFromParts(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
): number {
  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  const jd =
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    B -
    1524.5;

  // The fraction of a day, from the local clock time.
  const fraction = (hour + minute / 60) / 24;

  return jd + fraction - INDIA_UTC_OFFSET / 24;
}

/**
 * The same instant, given in UTC rather than in Indian local time.
 *
 * Only needed for a birth outside India, which is rare here but not impossible
 * — somebody's family in Dubai, or a birth recorded in London on a visit.
 */
export function julianDayFromUTC(
  year: number,
  month: number,
  day: number,
  hour = 0,
  minute = 0,
): number {
  let y = year;
  let m = month;

  if (m <= 2) {
    y -= 1;
    m += 12;
  }

  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);

  return (
    Math.floor(365.25 * (y + 4716)) +
    Math.floor(30.6001 * (m + 1)) +
    day +
    B -
    1524.5 +
    (hour + minute / 60) / 24
  );
}

/** Year, month and day from a Julian day number. */
export function partsFromJulianDay(jd: number): { year: number; month: number; day: number } {
  const z = Math.floor(jd + 0.5);
  const alpha = Math.floor((z - 1867216.25) / 36524.25);
  const a = z + 1 + alpha - Math.floor(alpha / 4);

  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);

  const day = b - d - Math.floor(30.6001 * e);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;

  return { year, month, day };
}

/** Age in whole years at a Julian day. */
export function ageAt(jd: number, birthYear: number, birthMonth: number, birthDay: number): number {
  const now = partsFromJulianDay(jd);
  let age = now.year - birthYear;

  // Before the birthday this year, one year less.
  if (now.month < birthMonth || (now.month === birthMonth && now.day < birthDay)) {
    age -= 1;
  }

  return age;
}