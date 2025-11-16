# Openfront Storefront

A standalone, decoupled storefront that connects to any Openfront backend instance. This allows you to create custom storefronts that consume data from your main Openfront installation.

Openfront is built with a feature-sliced architecture, including the storefront. This repository takes the storefront feature slice and packages it as a separate application that connects to your main Openfront instance via GraphQL API.

## Overview

This is a decoupled storefront built with Next.js 15 that communicates with Openfront's GraphQL API. You can deploy this separately from your main Openfront instance and connect it via environment variables.

## Quick Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```
4. Set your Openfront backend URL in `.env`:
   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
   ```
5. Start development server: `npm run dev`

## Environment Variables

### Required
- `NEXT_PUBLIC_BACKEND_URL` - URL of your Openfront backend instance (e.g., `http://localhost:3000`)

### Payment Providers (Client-side)
- `NEXT_PUBLIC_STRIPE_KEY` - Stripe publishable key
- `NEXT_PUBLIC_PAYPAL_CLIENT_ID` - PayPal client ID

### Optional
- `NEXT_PUBLIC_DEFAULT_REGION` - Default region code (default: `us`)
- `HIDE_OPENFRONT_BRANDING` - Set to `true` to hide Openfront branding

## How It Works

The storefront connects to your Openfront backend's GraphQL API at `${NEXT_PUBLIC_BACKEND_URL}/api/graphql`. All product data, cart management, checkout, and order processing happens through this API endpoint.

## Deploy

Deploy your own instance with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/openshiporg/openfront-storefront)

Make sure to set the `NEXT_PUBLIC_BACKEND_URL` environment variable to point to your Openfront backend.

## Documentation

For more information about Openfront, visit the main [Openfront repository](https://github.com/openshiporg/openfront).

## License

MIT
