-- Add content_type column to distinguish between file uploads and URL links
ALTER TABLE public.music ADD COLUMN IF NOT EXISTS content_type text NOT NULL DEFAULT 'file';
ALTER TABLE public.scores ADD COLUMN IF NOT EXISTS content_type text NOT NULL DEFAULT 'file';
ALTER TABLE public.videos ADD COLUMN IF NOT EXISTS content_type text NOT NULL DEFAULT 'file';
ALTER TABLE public.images ADD COLUMN IF NOT EXISTS content_type text NOT NULL DEFAULT 'file';
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS content_type text NOT NULL DEFAULT 'file';

-- Make file_name nullable for URL-based content
ALTER TABLE public.music ALTER COLUMN file_name DROP NOT NULL;
ALTER TABLE public.scores ALTER COLUMN file_name DROP NOT NULL;
ALTER TABLE public.videos ALTER COLUMN file_name DROP NOT NULL;
ALTER TABLE public.images ALTER COLUMN file_name DROP NOT NULL;
ALTER TABLE public.documents ALTER COLUMN file_name DROP NOT NULL;