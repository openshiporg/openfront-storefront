# Openfront Storefront

A standalone storefront that connects to any Openfront backend instance. This allows you to create custom storefronts that consume data from your main Openfront installation.

Openfront is built with a feature-sliced architecture, including the storefront. This repository takes the storefront feature slice and packages it as a separate application that connects to your main Openfront instance via GraphQL API.

## Overview

This is a decoupled storefront built with Next.js that communicates with Openfront's GraphQL API. You can deploy this separately from your main Openfront instance and connect it via environment variables.

## Quick Setup

1. Clone this repository
2. Install dependencies: `npm install`
3. Set your Openfront GraphQL endpoint in `.env`:
   ```
   OPENFRONT_GRAPHQL_ENDPOINT=https://your-openfront-instance.com/api/graphql
   ```
4. Start development server: `npm run dev`

## Environment Variables

- `OPENFRONT_GRAPHQL_ENDPOINT` - The GraphQL endpoint of your Openfront backend
- `HIDE_OPENFRONT_BRANDING` - Set to `true` to hide Openfront branding (optional)

## Deploy

Deploy your own instance with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/openship/openfront-storefront)

## Documentation

For more information about Openfront, visit the main [Openfront repository](https://github.com/openship/openfront).
