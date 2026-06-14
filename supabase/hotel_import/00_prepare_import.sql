-- Run this after supabase/complete_setup.sql and before part_*.sql files.
-- It validates that the target table matches the generated hotel import.

DO $$
DECLARE
  hotel_id_type TEXT;
BEGIN
  IF to_regclass('public.hotels') IS NULL THEN
    RAISE EXCEPTION 'public.hotels does not exist. Run supabase/complete_setup.sql first.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'hotels'
      AND column_name = 'hotel_name'
  ) THEN
    RAISE EXCEPTION 'public.hotels.hotel_name is missing. Run supabase/complete_setup.sql before importing hotels.';
  END IF;

  SELECT data_type
  INTO hotel_id_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'hotels'
    AND column_name = 'id';

  IF hotel_id_type <> 'integer' THEN
    RAISE EXCEPTION 'public.hotels.id must be integer for this import, found %', hotel_id_type;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'hotels_hotel_name_key'
      AND conrelid = 'public.hotels'::regclass
  ) THEN
    ALTER TABLE public.hotels
      ADD CONSTRAINT hotels_hotel_name_key UNIQUE (hotel_name);
  END IF;
END $$;
