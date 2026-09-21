CREATE TABLE public.quote_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 100),
  business_name text NOT NULL CHECK (char_length(business_name) BETWEEN 2 AND 120),
  email text NOT NULL CHECK (char_length(email) <= 255),
  phone text NOT NULL CHECK (char_length(phone) BETWEEN 7 AND 40),
  country text NOT NULL CHECK (char_length(country) BETWEEN 2 AND 100),
  business_type text NOT NULL CHECK (char_length(business_type) <= 80),
  has_website boolean NOT NULL,
  current_website_url text CHECK (current_website_url IS NULL OR char_length(current_website_url) <= 500),
  project_needs text[] NOT NULL CHECK (cardinality(project_needs) BETWEEN 1 AND 9),
  page_count text NOT NULL CHECK (char_length(page_count) <= 30),
  estimated_budget text NOT NULL CHECK (char_length(estimated_budget) <= 60),
  project_details text NOT NULL CHECK (char_length(project_details) BETWEEN 20 AND 3000),
  main_goal text NOT NULL CHECK (char_length(main_goal) <= 100),
  consent boolean NOT NULL CHECK (consent = true),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.quote_enquiries TO anon;
GRANT INSERT ON public.quote_enquiries TO authenticated;
GRANT ALL ON public.quote_enquiries TO service_role;

ALTER TABLE public.quote_enquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors can submit quote enquiries"
ON public.quote_enquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  consent = true
  AND char_length(full_name) BETWEEN 2 AND 100
  AND char_length(business_name) BETWEEN 2 AND 120
  AND char_length(email) <= 255
  AND char_length(phone) BETWEEN 7 AND 40
  AND char_length(country) BETWEEN 2 AND 100
  AND char_length(project_details) BETWEEN 20 AND 3000
  AND cardinality(project_needs) BETWEEN 1 AND 9
);

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_quote_enquiries_updated_at
BEFORE UPDATE ON public.quote_enquiries
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();