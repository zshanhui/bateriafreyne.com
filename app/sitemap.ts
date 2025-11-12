import { getCollections, getPages, getProducts } from 'lib/shopify';
import { baseUrl, validateEnvironmentVariables } from 'lib/utils';
import { MetadataRoute } from 'next';
import { locales } from '../middleware';

type Route = {
  url: string;
  lastModified: string;
};

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  validateEnvironmentVariables();

  const routesMap = [''].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString()
  }));

  const collectionsPromise = getCollections().then((collections) =>
    collections.map((collection) => ({
      url: `${baseUrl}${collection.path}`,
      lastModified: collection.updatedAt
    }))
  );

  const productsPromise = getProducts({}).then((products) =>
    products.map((product) => ({
      url: `${baseUrl}/product/${product.handle}`,
      lastModified: product.updatedAt
    }))
  );

  const pagesPromise = getPages().then((pages) =>
    pages.map((page) => ({
      url: `${baseUrl}/${page.handle}`,
      lastModified: page.updatedAt
    }))
  );

  let fetchedRoutes: Route[] = [];

  try {
    fetchedRoutes = (
      await Promise.all([collectionsPromise, productsPromise, pagesPromise])
    ).flat();
  } catch (error) {
    throw JSON.stringify(error, null, 2);
  }

  // Generate localized routes
  const localizedRoutes: Route[] = [];
  
  for (const locale of locales) {
    // Add localized home page
    localizedRoutes.push({
      url: `${baseUrl}/${locale}`,
      lastModified: new Date().toISOString()
    });

    // Add localized collections
    const localizedCollections = fetchedRoutes
      .filter(route => route.url.includes('/search/'))
      .map(route => ({
        url: route.url.replace(baseUrl, `${baseUrl}/${locale}`),
        lastModified: route.lastModified
      }));
    localizedRoutes.push(...localizedCollections);

    // Add localized products
    const localizedProducts = fetchedRoutes
      .filter(route => route.url.includes('/product/'))
      .map(route => ({
        url: route.url.replace(baseUrl, `${baseUrl}/${locale}`),
        lastModified: route.lastModified
      }));
    localizedRoutes.push(...localizedProducts);

    // Add localized pages
    const localizedPages = fetchedRoutes
      .filter(route => !route.url.includes('/product/') && !route.url.includes('/search/') && route.url !== baseUrl)
      .map(route => ({
        url: route.url.replace(baseUrl, `${baseUrl}/${locale}`),
        lastModified: route.lastModified
      }));
    localizedRoutes.push(...localizedPages);
  }

  return [...routesMap, ...fetchedRoutes, ...localizedRoutes];
}
