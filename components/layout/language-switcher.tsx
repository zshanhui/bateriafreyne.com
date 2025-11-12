'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, Locale, defaultLocale } from '../../middleware';

const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  zh: '中文',
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  // Extract current locale from pathname
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  const currentLocale = (firstSegment && locales.includes(firstSegment as Locale))
    ? (firstSegment as Locale)
    : defaultLocale;

  // Get path without locale
  const pathWithoutLocale = segments.length > 0 && locales.includes(segments[0] as Locale)
    ? '/' + segments.slice(1).join('/')
    : pathname;

  const handleLocaleChange = (newLocale: Locale) => {
    // Remove current locale from path and add new one
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    router.push(newPath);
  };

  return (
    <div className="relative inline-block">
      <select
        value={currentLocale}
        onChange={(e) => handleLocaleChange(e.target.value as Locale)}
        className="appearance-none rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
        aria-label="Select language"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeNames[locale]}
          </option>
        ))}
      </select>
    </div>
  );
}
