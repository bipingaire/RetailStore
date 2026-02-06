-- Create storage bucket for AI-generated images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ai-generated-images',
  'ai-generated-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Enable public access to read files
CREATE POLICY "Public Access to AI Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'ai-generated-images' );

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload AI images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'ai-generated-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own images
CREATE POLICY "Authenticated users can delete AI images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'ai-generated-images' 
  AND auth.role() = 'authenticated'
);
