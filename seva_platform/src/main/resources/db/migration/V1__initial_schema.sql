-- App Configuration (Single Row)
CREATE TABLE app_config (
    id INTEGER PRIMARY KEY,
    enable_events BOOLEAN NOT NULL DEFAULT TRUE,
    enable_gallery BOOLEAN NOT NULL DEFAULT TRUE,
    enable_artefacts BOOLEAN NOT NULL DEFAULT TRUE,
    enable_history BOOLEAN NOT NULL DEFAULT TRUE,
    enable_room_booking BOOLEAN NOT NULL DEFAULT TRUE,
    enable_seva BOOLEAN NOT NULL DEFAULT TRUE,
    enable_quiz BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert default configuration
INSERT INTO app_config (id, enable_events, enable_gallery, enable_artefacts, enable_history, enable_room_booking, enable_seva, enable_quiz, updated_at)
VALUES (1, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, CURRENT_TIMESTAMP);

-- Legal Content (Single Row)
CREATE TABLE legal_content (
    id INTEGER PRIMARY KEY,
    privacy_policy TEXT NOT NULL,
    terms_and_conditions TEXT NOT NULL,
    consent_text TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert default legal content
INSERT INTO legal_content (id, privacy_policy, terms_and_conditions, consent_text, updated_at)
VALUES (1,
    'Your privacy policy content here...',
    'Your terms and conditions content here...',
    'I consent to the storage of my personal information.',
    CURRENT_TIMESTAMP
);

-- Temple/Matha Information (Single Row)
CREATE TABLE temple_info (
    id VARCHAR(50) PRIMARY KEY,
    morning_darshan TEXT NOT NULL,
    morning_prasada TEXT NOT NULL,
    evening_darshan TEXT NOT NULL,
    evening_prasada TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert default temple info
INSERT INTO temple_info (id, morning_darshan, morning_prasada, evening_darshan, evening_prasada, updated_at)
VALUES ('default',
    '6:00 AM - 9:00 AM',
    '9:00 AM - 10:00 AM',
    '6:00 PM - 8:00 PM',
    '8:00 PM - 9:00 PM',
    CURRENT_TIMESTAMP
);

-- ============================================
-- CONTENT TABLES
-- ============================================

-- News Articles
CREATE TABLE news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    body TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_news_active ON news(active);
CREATE INDEX idx_news_created_at ON news(created_at DESC);

-- Flash Updates
CREATE TABLE flash_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    text VARCHAR(500) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_flash_active ON flash_updates(active);

-- Events
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    location VARCHAR(255),
    image_url TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('ARADHANA', 'PARYAYA', 'UTSAVA', 'GENERAL')),
    scope VARCHAR(50) NOT NULL CHECK (scope IN ('LOCAL', 'NATIONAL')),
    notify_users BOOLEAN NOT NULL DEFAULT FALSE,
    tithi_label TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_active ON events(active);
CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_type ON events(type);

-- Social Links
CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_social_active ON social_links(active);

-- ============================================
-- GALLERY TABLES
-- ============================================

-- Gallery Albums
CREATE TABLE gallery_albums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gallery_albums_active ON gallery_albums(active);

-- Gallery Media
CREATE TABLE gallery_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    album_id UUID NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL CHECK (type IN ('IMAGE', 'VIDEO')),
    title VARCHAR(255),
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_gallery_media_album ON gallery_media(album_id);

-- ============================================
-- ARTEFACTS & HISTORY
-- ============================================

-- Artefacts (PDFs, Audio files, etc.)
CREATE TABLE artefacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('PDF', 'AUDIO')),
    description TEXT,
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_artefacts_active ON artefacts(active);
CREATE INDEX idx_artefacts_category ON artefacts(category);
CREATE INDEX idx_artefacts_type ON artefacts(type);

-- History Sections
CREATE TABLE history_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    period TEXT,
    description TEXT,
    image_url TEXT,
    sort_order INTEGER NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_history_active ON history_sections(active);
CREATE INDEX idx_history_sort ON history_sections(sort_order);

-- ============================================
-- SEVA (SERVICES) TABLES
-- ============================================

-- Seva Services
CREATE TABLE sevas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount_in_paise INTEGER NOT NULL CHECK (amount_in_paise >= 0),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sevas_active ON sevas(active);

-- Seva Orders
CREATE TABLE seva_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uid VARCHAR(255) NOT NULL,
    seva_id UUID NOT NULL REFERENCES sevas(id),
    seva_title VARCHAR(255) NOT NULL,
    amount_in_paise INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('INITIATED', 'PAID', 'FAILED', 'CANCELLED')),
    consent_to_store BOOLEAN NOT NULL,

    -- User details (optional based on consent)
    full_name VARCHAR(255),
    mobile VARCHAR(20),
    email VARCHAR(255),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),

    -- Payment gateway details
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    razorpay_signature VARCHAR(512),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_seva_orders_uid ON seva_orders(uid);
CREATE INDEX idx_seva_orders_seva_id ON seva_orders(seva_id);
CREATE INDEX idx_seva_orders_status ON seva_orders(status);
CREATE INDEX idx_seva_orders_created ON seva_orders(created_at DESC);

-- ============================================
-- ROOM BOOKING
-- ============================================

CREATE TABLE room_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    people_count INTEGER NOT NULL CHECK (people_count > 0),
    check_in_date DATE NOT NULL,
    notes TEXT,
    consent_to_store BOOLEAN NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('NEW', 'EMAIL_SENT', 'EMAIL_FAILED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_room_bookings_status ON room_bookings(status);
CREATE INDEX idx_room_bookings_check_in ON room_bookings(check_in_date);
CREATE INDEX idx_room_bookings_created ON room_bookings(created_at DESC);

-- ============================================
-- QUIZ TABLES
-- ============================================

-- Quiz Questions
CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option VARCHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_questions_active ON quiz_questions(active);

-- Quiz Attempts (Leaderboard)
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_uid VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_uid);
CREATE INDEX idx_quiz_attempts_score ON quiz_attempts(score DESC);
CREATE INDEX idx_quiz_attempts_created ON quiz_attempts(created_at DESC);

-- ============================================
-- NOTIFICATION TABLES
-- ============================================

-- Push Notification Tokens
CREATE TABLE push_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_uid VARCHAR(255) NOT NULL,
    token TEXT NOT NULL UNIQUE,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_push_tokens_user ON push_tokens(user_uid);
CREATE INDEX idx_push_tokens_enabled ON push_tokens(enabled);


-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at columns
CREATE TRIGGER update_app_config_updated_at BEFORE UPDATE ON app_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_legal_content_updated_at BEFORE UPDATE ON legal_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_temple_info_updated_at BEFORE UPDATE ON temple_info
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sevas_updated_at BEFORE UPDATE ON sevas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seva_orders_updated_at BEFORE UPDATE ON seva_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_push_tokens_updated_at BEFORE UPDATE ON push_tokens
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - Remove in production)
-- ============================================

-- Sample Seva
INSERT INTO sevas (title, description, amount_in_paise, active)
VALUES
    ('Ekadina Seva', 'One day seva for the devotee', 10000, TRUE),
    ('Masika Seva', 'One month seva', 100000, TRUE),
    ('Varshika Seva', 'One year seva', 1000000, TRUE);

-- Sample Quiz Questions
INSERT INTO quiz_questions (question_text, option_a, option_b, option_c, option_d, correct_option, active)
VALUES
    ('Who is the founder of Madhva Sampradaya?', 'Sri Madhvacharya', 'Sri Ramanuja', 'Sri Shankaracharya', 'Sri Chaitanya', 'A', TRUE),
    ('What is the primary philosophy of Dvaita?', 'Non-dualism', 'Dualism', 'Qualified Non-dualism', 'None', 'B', TRUE);

COMMIT;