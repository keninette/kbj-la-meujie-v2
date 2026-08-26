CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE universe
    ADD COLUMN IF NOT EXISTS uuid VARCHAR;

UPDATE universe
SET uuid = gen_random_uuid()::text
WHERE uuid IS NULL
   OR uuid = '';

ALTER TABLE universe
    ALTER COLUMN uuid SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'universe_uuid_unique'
    ) THEN
        ALTER TABLE universe
            ADD CONSTRAINT universe_uuid_unique UNIQUE (uuid);
    END IF;
END
$$;

ALTER TABLE place
    ADD COLUMN IF NOT EXISTS uuid VARCHAR;

UPDATE place
SET uuid = gen_random_uuid()::text
WHERE uuid IS NULL
   OR uuid = '';

ALTER TABLE place
    ALTER COLUMN uuid SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'place_uuid_unique'
    ) THEN
        ALTER TABLE place
            ADD CONSTRAINT place_uuid_unique UNIQUE (uuid);
    END IF;
END
$$;

UPDATE place
SET picture = jsonb_set(
    picture,
    '{uuid}',
    to_jsonb(gen_random_uuid()::text),
    true
)
WHERE picture IS NOT NULL
  AND jsonb_typeof(picture) = 'object'
  AND (
      NOT (picture ? 'uuid')
      OR COALESCE(picture ->> 'uuid', '') = ''
  );

ALTER TABLE step
    ADD COLUMN IF NOT EXISTS uuid VARCHAR;

UPDATE step
SET uuid = gen_random_uuid()::text
WHERE uuid IS NULL
   OR uuid = '';

ALTER TABLE step
    ALTER COLUMN uuid SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'step_uuid_unique'
    ) THEN
        ALTER TABLE step
            ADD CONSTRAINT step_uuid_unique UNIQUE (uuid);
    END IF;
END
$$;

ALTER TABLE audio
    ADD COLUMN IF NOT EXISTS uuid VARCHAR;

UPDATE audio
SET uuid = gen_random_uuid()::text
WHERE uuid IS NULL
   OR uuid = '';

ALTER TABLE audio
    ALTER COLUMN uuid SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'audio_uuid_unique'
    ) THEN
        ALTER TABLE audio
            ADD CONSTRAINT audio_uuid_unique UNIQUE (uuid);
    END IF;
END
$$;

ALTER TABLE diceroll
    ADD COLUMN IF NOT EXISTS uuid VARCHAR;

UPDATE diceroll
SET uuid = gen_random_uuid()::text
WHERE uuid IS NULL
   OR uuid = '';

ALTER TABLE diceroll
    ALTER COLUMN uuid SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'diceroll_uuid_unique'
    ) THEN
        ALTER TABLE diceroll
            ADD CONSTRAINT diceroll_uuid_unique UNIQUE (uuid);
    END IF;
END
$$;

ALTER TABLE non_player_character
    ADD COLUMN IF NOT EXISTS uuid VARCHAR;

UPDATE non_player_character
SET uuid = gen_random_uuid()::text
WHERE uuid IS NULL
   OR uuid = '';

ALTER TABLE non_player_character
    ALTER COLUMN uuid SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'non_player_character_uuid_unique'
    ) THEN
        ALTER TABLE non_player_character
            ADD CONSTRAINT non_player_character_uuid_unique UNIQUE (uuid);
    END IF;
END
$$;
