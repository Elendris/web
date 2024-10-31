import { cs } from './cs';
import { en } from './en';

export const languages = {
  cs: 'Čeština',
  en: 'English',
};

export const defaultLang = 'cs';

export const ui = {
  cs,
  en,
} as const;