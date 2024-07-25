import {
  add as addFns,
  compareAsc,
  fromUnixTime,
  parseISO,
  subSeconds,
} from 'date-fns';
import type { Duration } from 'date-fns/types';

export function add(date: Date | number | string, duration: Duration) {
  return addFns(date, duration);
}

export function subtractSeconds(date: Date | number | string, amount: number) {
  return subSeconds(date, amount).toISOString();
}

export const getCurrentDate = () => {
  return new Date().toISOString();
};

export const fromUnixTimeToISO = (value: number) => {
  return fromUnixTime(value).toISOString();
};

export function isExpiredDate(
  expirationDate: string,
  currentDate: string,
): boolean {
  const comparisonResult = compareAsc(
    parseISO(expirationDate),
    parseISO(currentDate),
  );

  // Если дата истечения равна текущей дате, считаем, что она истекла
  if (comparisonResult === 0) {
    return true;
  }
  // Если дата истечения раньше текущей даты, значит она истекла
  if (comparisonResult < 0) {
    return true;
  }
  // Если дата истечения позже текущей даты, значит она не истекла

  return false;
}
