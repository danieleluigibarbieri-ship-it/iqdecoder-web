import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export type Attempt = {
  id: string;
  session_id: string;
  email?: string;
  answers: number[];
  score: number;
  percentile: number;
  created_at: string;
};

export type Payment = {
  id: string;
  attempt_id: string;
  stripe_session_id: string;
  stripe_payment_intent_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'succeeded' | 'failed' | 'canceled';
  created_at: string;
  updated_at: string;
};

export type Report = {
  id: string;
  attempt_id: string;
  pdf_url: string;
  accessed_count: number;
  expires_at: string;
  created_at: string;
};
