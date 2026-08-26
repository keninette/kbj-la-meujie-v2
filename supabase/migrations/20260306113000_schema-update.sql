DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'adventure'::regclass
          AND conname = 'adventure_universe_code_fk'
          AND contype = 'f'
    ) THEN
        ALTER TABLE adventure
            DROP CONSTRAINT adventure_universe_code_fk;
    END IF;

    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'universe'::regclass
          AND conname = 'universe_pk'
          AND contype = 'u'
    ) THEN
        ALTER TABLE universe
            DROP CONSTRAINT universe_pk;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'adventure'::regclass
          AND conname = 'adventure_universe_code_fk'
          AND contype = 'f'
    ) THEN
        ALTER TABLE adventure
            ADD CONSTRAINT adventure_universe_code_fk
                FOREIGN KEY (universe_code) REFERENCES universe (code);
    END IF;
END
$$;
