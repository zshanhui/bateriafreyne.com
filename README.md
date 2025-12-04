# BateriaFreyne next.js commerce storefront

A high-performance, server-rendered Next.js App Router eCommerce application designed for industrial B2B suppliers/manufacturers

This template uses React Server Components, Server Actions, `Suspense`, `useOptimistic`, and more. Based and modified from Vercel's Next.js Commerce Shopify template.

<h3 id="v1-note"></h3>

## Integrations

Integrations enable upgraded or additional functionality for Next.js Commerce

- [Orama](https://github.com/oramasearch/nextjs-commerce) ([Demo](https://vercel-commerce.oramasearch.com/))

  - Upgrades search to include typeahead with dynamic re-rendering, vector-based similarity search, and JS-based configuration.
  - Search runs entirely in the browser for smaller catalogs or on a CDN for larger.

- [React Bricks](https://github.com/ReactBricks/nextjs-commerce-rb) ([Demo](https://nextjs-commerce.reactbricks.com/))
  - Edit pages, product details, and footer content visually using [React Bricks](https://www.reactbricks.com) visual headless CMS.

## Running locally

You will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js Commerce. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables) for this, but a `.env` file is all that is necessary.

### Required Environment Variables

For the quote request PDF email system, you need to set the following environment variables:

- `RESEND_API_KEY` - Your Resend API key for sending emails. Get one at [resend.com](https://resend.com)
- `QUOTE_REQUEST_RECIPIENT_EMAILS` - Comma-separated list of email addresses that will receive quote requests (e.g., `sales@example.com,admin@example.com`)
- `RESEND_FROM_EMAIL` (optional) - The email address to send from. Defaults to `onboarding@resend.dev` if not set. Must be a verified domain in Resend.

```bash
pnpm install
pnpm dev
```

Your app should now be running on [localhost:3000](http://localhost:3000/).

## Next.js Commerce, and Shopify Integration Guide

You can use this comprehensive [integration guide](https://vercel.com/docs/integrations/ecommerce/shopify) with step-by-step instructions on how to configure Shopify as a headless CMS using Next.js Commerce as your headless Shopify storefront

## Deploying on Netlify Cloud

To be added...

## About 23Kuajing Networks

to be added...
