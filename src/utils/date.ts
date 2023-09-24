export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export interface Birthday {
  month: number;
  day: number;
}

export function parseMonth(month: string): number {
  return MONTHS.indexOf(month);
}

export function parseBirthday(birthday: string): Birthday | null {
  const [monthStr, dayStr] = birthday.split(' ');

  const month = parseMonth(monthStr);
  const day = parseInt(dayStr);

  if (month === -1 || isNaN(day)) {
    return null;
  }

  return {
    month,
    day,
  };
}
