// Single source of supported locales (same set and order as QuemLeva).
// To add one: list it here, create messages/<locale>.json, add its default categories to
// public.of_create_list (supabase/migrations) and run `npm run i18n:check`.

export const locales = ['pt-BR', 'es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pt-BR';

// Each language's name written in itself, for the switcher.
export const localeNames: Record<Locale, string> = {
  'pt-BR': 'Português', // short: it sits next to the brand and the list buttons
  es: 'Español',
  en: 'English',
};

// Open Graph locale codes (og:locale).
export const ogLocales: Record<Locale, string> = {
  'pt-BR': 'pt_BR',
  es: 'es_LA',
  en: 'en_US',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/** The [locale] route param as a Locale (the layout already rejects unknown values). */
export function asLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}
