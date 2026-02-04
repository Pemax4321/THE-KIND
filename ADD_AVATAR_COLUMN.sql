-- Add avatar_config column to users table for storing avatar customization
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_config TEXT;

-- This stores the avatar configuration as a JSON string
-- Example: {"skinTone":"medium","hairStyle":"long","hairColor":"brown","eyeShape":"round","eyeColor":"brown","expression":"happy"}
