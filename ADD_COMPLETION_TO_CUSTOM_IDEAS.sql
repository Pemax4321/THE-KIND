-- Add completion tracking to custom_kindness_ideas table
-- This migration adds fields to track when custom ideas are marked as completed

ALTER TABLE custom_kindness_ideas 
ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP WITH TIME ZONE;

-- Create an index on completed status for faster queries
CREATE INDEX IF NOT EXISTS idx_custom_ideas_completed ON custom_kindness_ideas(completed DESC);

-- Update the updated_at timestamp when marking an idea as completed
CREATE OR REPLACE FUNCTION update_custom_ideas_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop the old trigger if it exists
DROP TRIGGER IF EXISTS custom_ideas_update_timestamp ON custom_kindness_ideas;

-- Create the trigger to update updated_at on any update
CREATE TRIGGER custom_ideas_update_timestamp
BEFORE UPDATE ON custom_kindness_ideas
FOR EACH ROW
EXECUTE FUNCTION update_custom_ideas_timestamp();

-- Display completion summary
SELECT 'Migration complete: Added completion tracking to custom_kindness_ideas table' AS status;
