const IST_TIMEZONE = 'Asia/Kolkata';

const istDatePartsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: IST_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const istTimePartsFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: IST_TIMEZONE,
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

const istWeekdayFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: IST_TIMEZONE,
  weekday: 'long',
});

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function isValidDateKey(dateKey: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(dateKey);
}

export function parseValidDate(input?: string | Date | null): Date | null {
  if (!input) return null;
  const date = input instanceof Date ? new Date(input.getTime()) : new Date(input);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Returns YYYY-MM-DD calendar date in IST (Asia/Kolkata).
 */
export function getIstDateKey(input: Date | string = new Date()): string | null {
  const date = parseValidDate(input);
  if (!date) return null;

  const parts = istDatePartsFormatter.formatToParts(date);
  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;

  if (!year || !month || !day) return null;
  return `${year}-${month}-${day}`;
}

export function getTodayIstDateKey(now: Date = new Date()): string {
  return getIstDateKey(now) ?? new Date().toISOString().slice(0, 10);
}

export function shiftDateKey(dateKey: string, deltaDays: number): string {
  if (!isValidDateKey(dateKey)) return dateKey;
  const [y, m, d] = dateKey.split('-').map(Number);
  const shifted = new Date(Date.UTC(y, (m || 1) - 1, (d || 1) + deltaDays, 12, 0, 0));
  return `${shifted.getUTCFullYear()}-${pad2(shifted.getUTCMonth() + 1)}-${pad2(shifted.getUTCDate())}`;
}

export function getYesterdayIstDateKey(now: Date = new Date()): string {
  return shiftDateKey(getTodayIstDateKey(now), -1);
}

/**
 * Formats YYYY-MM-DD as Indian DD/MM/YYYY (e.g. 17/11/2026).
 */
export function formatDateKeyToIndian(dateKey?: string | null): string {
  if (!dateKey) return '';
  if (!isValidDateKey(dateKey)) {
    const parsed = parseValidDate(dateKey);
    const istKey = parsed ? getIstDateKey(parsed) : null;
    if (!istKey) return dateKey;
    const [y, m, d] = istKey.split('-');
    return `${d}/${m}/${y}`;
  }
  const [y, m, d] = dateKey.split('-');
  return `${d}/${m}/${y}`;
}

/**
 * Returns full weekday name (e.g. "Tuesday") for a YYYY-MM-DD date key in IST.
 */
export function getWeekdayFromDateKey(dateKey: string): string {
  if (!isValidDateKey(dateKey)) return '';
  const [y, m, d] = dateKey.split('-').map(Number);
  // Use 06:30 UTC (= 12:00 PM IST) so the IST calendar day is exact
  const middayIstUtc = new Date(Date.UTC(y, (m || 1) - 1, d || 1, 6, 30, 0));
  return istWeekdayFormatter.format(middayIstUtc);
}

/**
 * Formats date group heading in Indian convention:
 * - Today · 17/11/2026
 * - Yesterday · 16/11/2026
 * - Sunday · 15/11/2026
 */
export function formatJournalDayHeader(
  dateKey: string,
  now: Date = new Date()
): string {
  const indianDate = formatDateKeyToIndian(dateKey);
  if (!isValidDateKey(dateKey)) return indianDate;

  const todayIst = getTodayIstDateKey(now);
  const yesterdayIst = getYesterdayIstDateKey(now);

  if (dateKey === todayIst) {
    return `Today · ${indianDate}`;
  }
  if (dateKey === yesterdayIst) {
    return `Yesterday · ${indianDate}`;
  }
  const weekday = getWeekdayFromDateKey(dateKey);
  return weekday ? `${weekday} · ${indianDate}` : indianDate;
}

/**
 * Formats timestamp in 12-hour clock with AM/PM in IST (Asia/Kolkata), e.g. "09:30 AM".
 * Returns null if input is missing or invalid.
 */
export function formatIstTime12h(input?: string | Date | null): string | null {
  const date = parseValidDate(input);
  if (!date) return null;

  const parts = istTimePartsFormatter.formatToParts(date);
  const rawHour = parts.find((p) => p.type === 'hour')?.value;
  const minute = parts.find((p) => p.type === 'minute')?.value;
  const dayPeriod = parts.find((p) => p.type === 'dayPeriod')?.value;

  if (!rawHour || !minute || !dayPeriod) return null;
  const hourPadded = rawHour.padStart(2, '0');
  return `${hourPadded}:${minute} ${dayPeriod.toUpperCase()}`;
}

/**
 * Resolves the IST calendar date key (YYYY-MM-DD) for a journal entry.
 * Near-midnight entries recorded live with an unadjusted UTC/local date matching
 * their createdAt timestamp are grouped according to their actual date in IST (Asia/Kolkata),
 * while explicitly chosen past/custom entry.date values remain respected.
 */
export function resolveJournalEntryIstDateKey(
  entry: { date?: string; createdAt?: string },
  now: Date = new Date()
): string {
  const created = parseValidDate(entry.createdAt);
  if (created) {
    const istDate = getIstDateKey(created);
    const utcDate = created.toISOString().slice(0, 10);
    const localDate = `${created.getFullYear()}-${pad2(created.getMonth() + 1)}-${pad2(created.getDate())}`;

    if (
      istDate &&
      (!entry.date || entry.date === utcDate || entry.date === localDate)
    ) {
      return istDate;
    }
  }

  if (entry.date && isValidDateKey(entry.date)) {
    return entry.date;
  }

  return getTodayIstDateKey(now);
}

export function getJournalEntrySortTimestamp(entry: {
  date?: string;
  createdAt?: string;
}): number {
  const resolvedKey = resolveJournalEntryIstDateKey(entry);
  const created = parseValidDate(entry.createdAt);
  if (created) {
    const createdIstKey = getIstDateKey(created);
    if (createdIstKey === resolvedKey) {
      return created.getTime();
    }
  }
  if (isValidDateKey(resolvedKey)) {
    const [y, m, d] = resolvedKey.split('-').map(Number);
    return Date.UTC(y, (m || 1) - 1, d || 1, 6, 30, 0);
  }
  return created?.getTime() ?? 0;
}
