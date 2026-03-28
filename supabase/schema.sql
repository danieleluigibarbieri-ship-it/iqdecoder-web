create extension if not exists pgcrypto;

create table if not exists public.iq_attempts (
  id uuid primary key default gen_random_uuid(),
  public_token uuid not null unique,
  locale text not null default 'en',
  gender text null check (gender in ('male', 'female')),
  status text not null default 'completed' check (status in ('completed', 'paid')),
  question_set_version text not null,
  submitted_at timestamptz not null default now(),
  paid_at timestamptz null,
  duration_sec integer not null check (duration_sec > 0),
  answers jsonb not null,
  score_total integer not null,
  score_breakdown jsonb not null,
  analysis jsonb not null,
  email text null,
  stripe_checkout_session_id text null unique,
  stripe_payment_intent_id text null unique,
  amount_cents integer null,
  currency text null,
  report_pdf_url text null
);

create index if not exists iq_attempts_public_token_idx on public.iq_attempts (public_token);
create index if not exists iq_attempts_status_idx on public.iq_attempts (status);
create index if not exists iq_attempts_submitted_at_idx on public.iq_attempts (submitted_at desc);
