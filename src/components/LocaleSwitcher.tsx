'use client';

import {useLocale, useTranslations} from 'next-intl';
import {useTransition} from 'react';
import {usePathname, useRouter} from '@/i18n/navigation';
import {isLocale, localeNames, locales} from '@/i18n/locales';

// Switches the language without changing the URL: sets the OQF_LOCALE cookie and reloads the route.
// The list itself (its name, items and category names) is data and stays as people wrote it.
export function LocaleSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <label className="localeSwitcher">
      <span>{t('label')}</span>
      <select
        value={locale}
        disabled={isPending}
        onChange={(event) => {
          const next = event.target.value;
          if (!isLocale(next)) return;
          startTransition(() => {
            router.replace(pathname, {locale: next});
          });
        }}
      >
        {locales.map((value) => (
          <option key={value} value={value}>
            {localeNames[value]}
          </option>
        ))}
      </select>
    </label>
  );
}
