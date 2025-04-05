export const JST_OFFSET = 9; // JST is UTC+9, in hours

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export interface Birthday {
  month: number;
  day: number;
}

export function parseMonth(month: string): number {
  return MONTHS.indexOf(month);
}

export function parseBirthday(birthday: string): Birthday | null {
  const [monthStr, dayStr] = birthday.split(" ");

  const month = parseMonth(monthStr);
  const day = Number.parseInt(dayStr);

  if (month === -1 || Number.isNaN(day)) {
    return null;
  }

  return {
    month,
    day,
  };
}

export function dateToJST(date: Date): Date {
  return new Date(date.getTime() + JST_OFFSET * 60 * 60 * 1000);
}

export function currentTimeJST(): Date {
  return dateToJST(new Date());
}

export function currentClosestBreakpointJST(): Date {
  const jstNow = currentTimeJST();

  const year = jstNow.getUTCFullYear();
  const month = jstNow.getUTCMonth();
  const date = jstNow.getUTCDate();
  const hour = jstNow.getUTCHours();

  if (hour < 4) {
    // Before 4:00 JST, use 16:00 JST from the previous day
    return new Date(Date.UTC(year, month, date - 1, 16 - JST_OFFSET, 0, 0));
  }

  if (hour >= 4 && hour < 16) {
    // Between 4:00 and 16:00 JST, use 4:00
    return new Date(Date.UTC(year, month, date, 4 - JST_OFFSET, 0, 0));
  }

  // After 16:00 JST, use 16:00 JST
  return new Date(Date.UTC(year, month, date, 16 - JST_OFFSET, 0, 0));
}

export function resetTimeForDateJST(jstDate: Date): Date {
  const year = jstDate.getUTCFullYear();
  const month = jstDate.getUTCMonth();
  const date = jstDate.getUTCDate();
  const hour = jstDate.getUTCHours();

  if (hour < 4) {
    // Before 4:00 JST, use 4:00 JST from the previous day
    return new Date(Date.UTC(year, month, date - 1, 4 - JST_OFFSET, 0, 0));
  }

  // After 4:00 JST, use 4:00 JST
  return new Date(Date.UTC(year, month, date, 4 - JST_OFFSET, 0, 0));
}

export function currentResetJST() {
  const jstNow = currentTimeJST();
  return resetTimeForDateJST(jstNow);
}
