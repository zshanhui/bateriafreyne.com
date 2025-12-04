import { Locale, locales, defaultLocale } from '../middleware';

// Translation messages structure
export type Messages = {
  [key: string]: string | Messages;
};

// Load translations dynamically
export async function getTranslations(locale: Locale): Promise<Messages> {
  try {
    const messages = await import(`../messages/${locale}.json`);
    return messages.default;
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error);
    // Fallback to default locale
    if (locale !== defaultLocale) {
      try {
        const defaultMessages = await import(`../messages/${defaultLocale}.json`);
        return defaultMessages.default;
      } catch {
        return {};
      }
    }
    return {};
  }
}

// Get nested translation value by key path (e.g., 'common.nav.home')
export function getNestedTranslation(
  messages: Messages,
  key: string
): string {
  const keys = key.split('.');
  let value: string | Messages | undefined = messages;

  for (const k of keys) {
    if (typeof value === 'object' && value !== null && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  return typeof value === 'string' ? value : key;
}

// Create a translation function for a specific locale
export function createTranslator(locale: Locale) {
  return async (key: string): Promise<string> => {
    const messages = await getTranslations(locale);
    return getNestedTranslation(messages, key);
  };
}

// Get locale from pathname
export function getLocaleFromPath(pathname: string): Locale {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return firstSegment as Locale;
  }
  
  return defaultLocale;
}

// Remove locale from pathname
export function removeLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && locales.includes(firstSegment as Locale)) {
    return '/' + segments.slice(1).join('/');
  }
  
  return pathname;
}
