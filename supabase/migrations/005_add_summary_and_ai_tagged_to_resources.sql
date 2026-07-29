-- Add summary and ai_tagged columns to the resources table
ALTER TABLE public.resources 
ADD COLUMN IF NOT EXISTS summary TEXT,
ADD COLUMN IF NOT EXISTS ai_tagged BOOLEAN DEFAULT false;
