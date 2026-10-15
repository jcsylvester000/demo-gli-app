-- GLI website schema. Idempotent: safe to run on every deploy (scripts/db-migrate.ts).
-- Money is stored as integer centavos. Admin/auth tables are added in Batch 5 (Better Auth).

CREATE TABLE IF NOT EXISTS consent_text (
  version      TEXT PRIMARY KEY,
  body         TEXT NOT NULL,
  active_from  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ticket_counter (
  yymm     CHAR(4) PRIMARY KEY,
  last_no  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lead (
  id                 BIGSERIAL PRIMARY KEY,
  ticket_no          TEXT UNIQUE,
  kind               TEXT NOT NULL CHECK (kind IN ('quote', 'contact', 'newsletter')),
  services           TEXT[] NOT NULL DEFAULT '{}',
  industry           TEXT,
  products           TEXT[] NOT NULL DEFAULT '{}',
  event_date         DATE,
  venue              TEXT,
  qty_sizes          TEXT,
  budget_band        TEXT,
  notes              TEXT,
  name               TEXT,
  company            TEXT,
  email              TEXT NOT NULL,
  mobile             TEXT,
  preferred_channel  TEXT,
  consent_version    TEXT REFERENCES consent_text(version),
  consent_at         TIMESTAMPTZ,
  newsletter_opt_in  BOOLEAN NOT NULL DEFAULT false,
  utm_source         TEXT,
  utm_medium         TEXT,
  utm_campaign       TEXT,
  landing_page       TEXT,
  ip_hash            TEXT,
  status             TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'proposal_sent', 'won', 'lost', 'spam')),
  lost_reason        TEXT,
  owner_id           TEXT,
  priority           TEXT CHECK (priority IN ('hot', 'warm', 'cold')),
  follow_up_at       DATE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lead_created_idx ON lead (created_at DESC);
CREATE INDEX IF NOT EXISTS lead_status_idx ON lead (status);
CREATE INDEX IF NOT EXISTS lead_kind_idx ON lead (kind);
CREATE INDEX IF NOT EXISTS lead_email_idx ON lead (lower(email));

CREATE TABLE IF NOT EXISTS lead_file (
  id          BIGSERIAL PRIMARY KEY,
  lead_id     BIGINT NOT NULL REFERENCES lead(id) ON DELETE CASCADE,
  blob_key    TEXT NOT NULL UNIQUE,
  filename    TEXT NOT NULL,
  mime        TEXT NOT NULL,
  size_bytes  INTEGER NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 26214400),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lead_file_lead_idx ON lead_file (lead_id);

CREATE TABLE IF NOT EXISTS lead_activity (
  id          BIGSERIAL PRIMARY KEY,
  lead_id     BIGINT NOT NULL REFERENCES lead(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  body        TEXT,
  actor_id    TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS lead_activity_lead_idx ON lead_activity (lead_id, created_at);

-- Retry queue for auto-reply / sales notification / team alert (a failed send never loses the lead).
CREATE TABLE IF NOT EXISTS outbox (
  id          BIGSERIAL PRIMARY KEY,
  lead_id     BIGINT REFERENCES lead(id) ON DELETE CASCADE,
  channel     TEXT NOT NULL,
  payload     JSONB NOT NULL,
  attempts    INTEGER NOT NULL DEFAULT 0,
  last_error  TEXT,
  sent_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (lead_id, channel)
);
CREATE INDEX IF NOT EXISTS outbox_pending_idx ON outbox (created_at) WHERE sent_at IS NULL;

-- Governance registers (edited in the admin; read by the public site).
CREATE TABLE IF NOT EXISTS client_permission (
  client_slug      TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  industry         TEXT,
  status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('yes', 'name_only', 'no', 'pending')),
  permission_date  DATE,
  evidence_note    TEXT,
  updated_by       TEXT,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS case_status (
  case_slug     TEXT PRIMARY KEY,
  workflow      TEXT NOT NULL DEFAULT 'draft' CHECK (workflow IN ('draft', 'in_review', 'permission_check', 'approved', 'published')),
  rx_sensitive  BOOLEAN NOT NULL DEFAULT false,
  rx_cleared    BOOLEAN NOT NULL DEFAULT false,
  updated_by    TEXT,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT rx_gate CHECK (NOT (workflow = 'published' AND rx_sensitive AND NOT rx_cleared))
);

CREATE TABLE IF NOT EXISTS testimonial (
  id             BIGSERIAL PRIMARY KEY,
  quote          TEXT NOT NULL,
  person         TEXT NOT NULL,
  title          TEXT,
  client_slug    TEXT REFERENCES client_permission(client_slug),
  approved       BOOLEAN NOT NULL DEFAULT false,
  evidence_note  TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_setting (
  product_slug             TEXT PRIMARY KEY,
  starting_price_centavos  BIGINT CHECK (starting_price_centavos IS NULL OR starting_price_centavos > 0),
  lead_time                TEXT,
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_setting (
  key         TEXT PRIMARY KEY,
  value       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS redirect (
  from_path   TEXT PRIMARY KEY CHECK (from_path LIKE '/%'),
  to_path     TEXT NOT NULL,
  code        SMALLINT NOT NULL DEFAULT 301 CHECK (code IN (301, 302)),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (from_path <> to_path)
);

CREATE TABLE IF NOT EXISTS admin_audit (
  id          BIGSERIAL PRIMARY KEY,
  actor_id    TEXT,
  action      TEXT NOT NULL,
  target      TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed: consent text v1 (Document 4, Request a Quote, Step 4).
INSERT INTO consent_text (version, body) VALUES
  ('v1', 'I agree that Graphics Library, Inc. may use my details to respond to this request, as described in the Privacy Notice.')
ON CONFLICT (version) DO NOTHING;
INSERT INTO consent_text (version, body) VALUES
  ('newsletter-v1', 'Send me Show Floor Notes (4 emails a year). I can unsubscribe at any time. See the Privacy Notice.')
ON CONFLICT (version) DO NOTHING;
CREATE INDEX IF NOT EXISTS lead_ip_recent_idx ON lead (ip_hash, created_at);

-- Batch 4: chunked private uploads (Netlify function bodies are ~6 MB, so files arrive in ≤ 4 MB parts).
CREATE TABLE IF NOT EXISTS upload_session (
  id           TEXT PRIMARY KEY,               -- 32 hex chars, unguessable
  filename     TEXT NOT NULL,
  mime         TEXT NOT NULL,
  size_bytes   INTEGER NOT NULL CHECK (size_bytes > 0 AND size_bytes <= 26214400),
  part_count   INTEGER NOT NULL CHECK (part_count BETWEEN 1 AND 8),
  parts_done   INTEGER[] NOT NULL DEFAULT '{}',
  status       TEXT NOT NULL DEFAULT 'uploading' CHECK (status IN ('uploading', 'ready', 'rejected', 'linked')),
  ip_hash      TEXT,
  lead_id      BIGINT REFERENCES lead(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS upload_session_ip_idx ON upload_session (ip_hash, created_at);
ALTER TABLE lead_file ADD COLUMN IF NOT EXISTS part_count INTEGER NOT NULL DEFAULT 1;
ALTER TABLE outbox ADD COLUMN IF NOT EXISTS next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now();
INSERT INTO consent_text (version, body) VALUES
  ('contact-v1', 'I agree that Graphics Library, Inc. may use my details to respond to this enquiry, as described in the Privacy Notice.')
ON CONFLICT (version) DO NOTHING;
