import dayjs from './dayjs';
import { getLocale } from 'umi';

/**
 * Normalizes the locale string from umi (e.g., 'vi-VN', 'en-US') 
 * to dayjs locale (e.g., 'vi', 'en').
 */
const getDayjsLocale = () => {
  const locale = getLocale();
  if (locale.startsWith('vi')) return 'vi';
  return 'en';
};

/**
 * Format string based on locale
 * @returns {string} Format string (e.g., 'DD/MM/YYYY' for vi, 'MM/DD/YYYY' for en)
 */
export const getDateFormat = (): string => {
  const locale = getDayjsLocale();
  return locale === 'vi' ? 'DD/MM/YYYY' : 'MM/DD/YYYY';
};

/**
 * Format string for DateTime based on locale
 * @returns {string} Format string
 */
export const getDateTimeFormat = (): string => {
  const locale = getDayjsLocale();
  return locale === 'vi' ? 'DD/MM/YYYY HH:mm' : 'MM/DD/YYYY HH:mm';
};

/**
 * Formats a date string or object into a standardized string based on the current locale.
 * @param date - The date to format (string, Date, dayjs object)
 * @param formatStr - Optional explicit format string (overrides locale default)
 * @returns {string} Formatted date string
 */
export const formatDate = (date: any, formatStr?: string): string => {
  if (!date) return '';
  const locale = getDayjsLocale();
  const format = formatStr || (locale === 'vi' ? 'DD/MM/YYYY' : 'MM/DD/YYYY');
  return dayjs(date).locale(locale).format(format);
};

/**
 * Formats a date string or object into a standardized DateTime string based on the current locale.
 * @param date - The date to format
 * @param formatStr - Optional explicit format string
 * @returns {string} Formatted date time string
 */
export const formatDateTime = (date: any, formatStr?: string): string => {
  if (!date) return '';
  const locale = getDayjsLocale();
  const format = formatStr || (locale === 'vi' ? 'DD/MM/YYYY HH:mm' : 'MM/DD/YYYY HH:mm');
  return dayjs(date).locale(locale).format(format);
};
