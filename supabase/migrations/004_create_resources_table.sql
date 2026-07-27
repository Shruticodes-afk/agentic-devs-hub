-- Create the resources table
CREATE TABLE IF NOT EXISTS public.resources (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL CHECK (type IN ('guide', 'template', 'deck', 'link')),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    added_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read resources
CREATE POLICY "Enable read access for all authenticated users"
    ON public.resources
    FOR SELECT
    TO authenticated
    USING (true);

-- Create policy to allow all authenticated users to insert resources
CREATE POLICY "Enable insert access for authenticated users"
    ON public.resources
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = added_by);
