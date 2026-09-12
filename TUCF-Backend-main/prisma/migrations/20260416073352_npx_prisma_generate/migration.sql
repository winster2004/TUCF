DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'User'
      AND column_name = 'name'
  ) THEN
    ALTER TABLE "User" ALTER COLUMN "name" DROP DEFAULT;
  END IF;
END $$;
