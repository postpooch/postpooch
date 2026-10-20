-- Add an optional color to the social-media city catalog so the markets a
-- realtor serves can be color-coded in the studio the same way contact
-- stages are color-coded in the CRM.

alter table public.social_media_cities
  add column if not exists color text;