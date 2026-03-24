-- IQDecoder schema v2
-- Tables for attempts, payments, reports

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Attempts (quiz submissions)
CREATE TABLE IF NOT EXISTS attempts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    session_id TEXT NOT NULL,
    answers JSONB NOT NULL,
    score INTEGER NOT NULL,
    percentile INTEGER NOT NULL,
    email TEXT,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT score_range CHECK (score >= 0 AND score <= 100),
    CONSTRAINT percentile_range CHECK (percentile >= 1 AND percentile <= 99)
);

-- Payments (Stripe)
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_checkout_session_id TEXT UNIQUE NOT NULL,
    amount INTEGER NOT NULL, -- in cents
    currency TEXT DEFAULT 'eur',
    status TEXT NOT NULL DEFAULT 'pending', -- pending, succeeded, failed, canceled
    email_sent BOOLEAN DEFAULT FALSE,
    email_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reports (PDF generation metadata)
CREATE TABLE IF NOT EXISTS reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES payments(id) ON DELETE CASCADE,
    pdf_url TEXT,
    pdf_storage_path TEXT,
    accessed_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
);

-- Storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('iqdecoder-reports', 'iqdecoder-reports', false)
ON CONFLICT (id) DO NOTHING;

-- RLS policies
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Attempts: users can read their own attempts by session_id
CREATE POLICY "Users can read own attempts" ON attempts
    FOR SELECT USING (session_id = current_setting('app.session_id', true));

-- Attempts: allow insert for anyone
CREATE POLICY "Anyone can create attempts" ON attempts
    FOR INSERT WITH CHECK (true);

-- Payments: users can read their own payments
CREATE POLICY "Users can read own payments" ON payments
    FOR SELECT USING (attempt_id IN (SELECT id FROM attempts WHERE session_id = current_setting('app.session_id', true)));

-- Payments: allow insert for webhook (service role)
CREATE POLICY "Service role can manage payments" ON payments
    FOR ALL USING (auth.role() = 'service_role');

-- Reports: users can read their own reports
CREATE POLICY "Users can read own reports" ON reports
    FOR SELECT USING (attempt_id IN (SELECT id FROM attempts WHERE session_id = current_setting('app.session_id', true)));

-- Reports: allow insert for service role
CREATE POLICY "Service role can manage reports" ON reports
    FOR ALL USING (auth.role() = 'service_role');

-- Storage policies for reports bucket
CREATE POLICY "Users can read own reports from storage" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'iqdecoder-reports' 
        AND (storage.foldername(name))[1] IN (
            SELECT id::text FROM attempts WHERE session_id = current_setting('app.session_id', true)
        )
    );

CREATE POLICY "Service role can manage report storage" ON storage.objects
    FOR ALL USING (bucket_id = 'iqdecoder-reports' AND auth.role() = 'service_role');

-- Indexes for performance
CREATE INDEX idx_attempts_session_id ON attempts(session_id);
CREATE INDEX idx_attempts_created_at ON attempts(created_at DESC);
CREATE INDEX idx_payments_attempt_id ON payments(attempt_id);
CREATE INDEX idx_payments_stripe_session_id ON payments(stripe_checkout_session_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_reports_attempt_id ON reports(attempt_id);
CREATE INDEX idx_reports_payment_id ON reports(payment_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
