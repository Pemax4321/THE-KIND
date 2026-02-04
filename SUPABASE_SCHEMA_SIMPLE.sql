-- THE KIND - Simplified Database Schema (No Function Issues)
-- Supabase PostgreSQL Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Kindness Acts table
CREATE TABLE IF NOT EXISTS kindness_acts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  is_system BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT valid_category CHECK (category IN ('Connection', 'Daily Life', 'Digital', 'Academic', 'Community'))
);

-- Custom Kindness Ideas
CREATE TABLE IF NOT EXISTS custom_kindness_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT valid_category CHECK (category IN ('Connection', 'Daily Life', 'Digital', 'Academic', 'Community'))
);

-- Reflections Journal
CREATE TABLE IF NOT EXISTS reflections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  act_id UUID REFERENCES kindness_acts(id) ON DELETE SET NULL,
  title TEXT,
  content TEXT NOT NULL,
  mood TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT valid_mood CHECK (mood IN ('happy', 'sad', 'calm', 'anxious', 'grateful', 'loved', 'neutral', 'frustrated'))
);

-- Mood Logs
CREATE TABLE IF NOT EXISTS moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT valid_mood CHECK (mood IN ('happy', 'sad', 'calm', 'anxious', 'grateful', 'loved', 'neutral', 'frustrated'))
);

-- Indexes (simple, no functions)
CREATE INDEX idx_kindness_acts_user_id ON kindness_acts(user_id);
CREATE INDEX idx_kindness_acts_is_system ON kindness_acts(is_system);
CREATE INDEX idx_kindness_acts_completed ON kindness_acts(completed);
CREATE INDEX idx_kindness_acts_created_at ON kindness_acts(created_at DESC);
CREATE INDEX idx_custom_ideas_user_id ON custom_kindness_ideas(user_id);
CREATE INDEX idx_custom_ideas_created_at ON custom_kindness_ideas(created_at DESC);
CREATE INDEX idx_reflections_user_id ON reflections(user_id);
CREATE INDEX idx_reflections_created_at ON reflections(created_at DESC);
CREATE INDEX idx_reflections_mood ON reflections(mood);
CREATE INDEX idx_moods_user_id ON moods(user_id);
CREATE INDEX idx_moods_created_at ON moods(created_at DESC);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE kindness_acts ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_kindness_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own profile" 
  ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "System acts are visible to all, user acts only to owner" 
  ON kindness_acts FOR SELECT USING (is_system = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can create kindness acts" 
  ON kindness_acts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own acts" 
  ON kindness_acts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own acts" 
  ON kindness_acts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own custom ideas" 
  ON custom_kindness_ideas FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create custom ideas" 
  ON custom_kindness_ideas FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideas" 
  ON custom_kindness_ideas FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas" 
  ON custom_kindness_ideas FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own reflections" 
  ON reflections FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create reflections" 
  ON reflections FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflections" 
  ON reflections FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reflections" 
  ON reflections FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can only see their own moods" 
  ON moods FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create mood entries" 
  ON moods FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood entries" 
  ON moods FOR DELETE USING (auth.uid() = user_id);

-- Seed system kindness acts
INSERT INTO kindness_acts (description, category, is_system, user_id) VALUES
('Send a message to someone you haven''t spoken to in a while', 'Connection', TRUE, NULL),
('Call a friend or family member just to chat', 'Connection', TRUE, NULL),
('Write a thank you note to someone who helped you', 'Connection', TRUE, NULL),
('Invite someone lonely to join an activity', 'Connection', TRUE, NULL),
('Listen to someone''s problems without judgment', 'Connection', TRUE, NULL),
('Compliment a stranger on something genuine', 'Connection', TRUE, NULL),
('Share a meal with someone who lives alone', 'Connection', TRUE, NULL),
('Visit someone elderly or isolated', 'Connection', TRUE, NULL),
('Help someone carry groceries or packages', 'Daily Life', TRUE, NULL),
('Pay for someone''s coffee behind you in line', 'Daily Life', TRUE, NULL),
('Leave a quarter in a vending machine for someone', 'Daily Life', TRUE, NULL),
('Shovel snow or rake leaves for an elderly neighbor', 'Daily Life', TRUE, NULL),
('Return a shopping cart for someone', 'Daily Life', TRUE, NULL),
('Let someone merge in front of you in traffic', 'Daily Life', TRUE, NULL),
('Leave coins in parking meters for others', 'Daily Life', TRUE, NULL),
('Volunteer at a local food bank', 'Daily Life', TRUE, NULL),
('Share someone''s work or achievement online', 'Digital', TRUE, NULL),
('Leave an encouraging comment on social media', 'Digital', TRUE, NULL),
('Send a positive message to someone online', 'Digital', TRUE, NULL),
('Share helpful information in a forum or group', 'Digital', TRUE, NULL),
('Give honest feedback on someone''s creative work', 'Digital', TRUE, NULL),
('Report cyberbullying when you see it', 'Digital', TRUE, NULL),
('Share a resource that helped you with others', 'Digital', TRUE, NULL),
('Like and share educational content', 'Digital', TRUE, NULL),
('Help a classmate with a difficult subject', 'Academic', TRUE, NULL),
('Explain a concept clearly to someone struggling', 'Academic', TRUE, NULL),
('Lend notes or study materials to classmates', 'Academic', TRUE, NULL),
('Form a study group to help others learn', 'Academic', TRUE, NULL),
('Tutor someone without expecting payment', 'Academic', TRUE, NULL),
('Encourage someone doubting their abilities', 'Academic', TRUE, NULL),
('Share free learning resources with peers', 'Academic', TRUE, NULL),
('Proofread someone''s essay or assignment', 'Academic', TRUE, NULL),
('Pick up litter in your neighborhood', 'Community', TRUE, NULL),
('Donate to a local cause or charity', 'Community', TRUE, NULL),
('Volunteer for community cleanup events', 'Community', TRUE, NULL),
('Join a community service organization', 'Community', TRUE, NULL),
('Help register people for voting', 'Community', TRUE, NULL),
('Donate books to a library or school', 'Community', TRUE, NULL),
('Participate in a charity event or marathon', 'Community', TRUE, NULL),
('Plant trees or flowers in a public space', 'Community', TRUE, NULL)
ON CONFLICT DO NOTHING;
