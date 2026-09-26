CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY, title VARCHAR(150) NOT NULL, body TEXT NOT NULL,
    created_by INTEGER REFERENCES admins(id) ON DELETE SET NULL, created_at TIMESTAMP NOT NULL DEFAULT NOW());
CREATE INDEX IF NOT EXISTS idx_announcements_created_at ON announcements(created_at DESC);
CREATE TABLE IF NOT EXISTS push_tokens (
    id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, role VARCHAR(10) NOT NULL CHECK (role IN ('admin','student')),
    token VARCHAR(255) NOT NULL UNIQUE, created_at TIMESTAMP NOT NULL DEFAULT NOW());
CREATE INDEX IF NOT EXISTS idx_push_tokens_role ON push_tokens(role);
CREATE INDEX IF NOT EXISTS idx_push_tokens_user ON push_tokens(user_id, role);
