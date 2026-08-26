DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'universe'::regclass
          AND contype = 'p'
    ) THEN
        ALTER TABLE universe
            ALTER COLUMN code SET NOT NULL;

        ALTER TABLE universe
            ADD CONSTRAINT universe_pkey PRIMARY KEY (code);
    END IF;
END
$$;
