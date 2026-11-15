import {defineRouting} from 'next-intl/routing';
import {defaultLocale, locales} from './locales';

// localePrefix 'never': URLs never carry the locale.
// A list link (/l/<slug>) is the same for everyone who shares it, and each person sees the UI
// in their own language. The proxy rewrites internally to /<locale>/l/<slug>, picking the
// locale from the cookie, then from Accept-Language, then pt-BR.
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'never',
  localeCookie: {
    name: 'OQF_LOCALE',
    maxAge: 60 * 60 * 24 * 365,
  },
});
