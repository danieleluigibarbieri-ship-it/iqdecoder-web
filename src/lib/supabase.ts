import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Types
export type Attempt = {
  id: string;
  session_id: string;
  answers: any;
  score: number;
  percentile: number;
  email?: string;
  created_at: string;
};

export type Payment = {
  id: string;
  attempt_id: string;
  stripe_payment_intent_id: string;
  stripe_checkout_session_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  email_sent: boolean;
  created_at: string;
  updated_at: string;
};

export type Report = {
  id: string;
  attempt_id: string;
  payment_id: string;
  pdf_url: string;
  pdf_storage_path: string;
  accessed_count: number;
  created_at: string;
  expires_at: string;
};
