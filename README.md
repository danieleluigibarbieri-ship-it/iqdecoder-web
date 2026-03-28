# IQ Decoder Web

Conversion-first IQ test funnel built with Next.js, Stripe, and Supabase.

Flow:

`/` (pre-test) -> `/test` (20 questions) -> `/checkout/[publicToken]` -> Stripe Checkout -> webhook -> `/result/[publicToken]` unlock

## Stack

- Next.js 16 (App Router + TypeScript)
- Stripe Checkout + Webhook
- Supabase (attempt storage)
- CSS Modules

## Local setup

1. Install deps

```bash
npm ci --include=dev
```

2. Create `.env.local` from `.env.example`

Required variables:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

3. Create DB table in Supabase:

- Execute `supabase/schema.sql`

4. Run app

```bash
npm run dev
```

## Webhook local testing (Stripe CLI)

1. Start app:

```bash
npm run dev
```

2. Forward Stripe events:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

3. Copy generated signing secret into `STRIPE_WEBHOOK_SECRET`.

## Commands

- `npm run lint`
- `npm test`
- `npm run build`
- `npm run start`

## API endpoints

- `GET /api/health`
- `POST /api/test/submit`
- `POST /api/checkout/create`
- `POST /api/stripe/webhook`
- `GET /api/result/[publicToken]`

## Expected smoke checks

- `GET /`, `/test`, `/pricing`, `/faq`
- `GET /api/health`
- `POST /api/test/submit`
- `POST /api/checkout/create`

Without env variables, API checks are expected to fail with explicit error messages.

## Vercel deploy notes

Set all env vars in Vercel Project Settings, then deploy:

```bash
vercel --prod
```

After deploy, confirm:

1. Checkout creates Stripe session
2. Stripe webhook reaches `/api/stripe/webhook`
3. Attempt status moves to `paid`
4. `/result/[publicToken]` unlocks analysis
