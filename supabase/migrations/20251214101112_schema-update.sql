ALTER TABLE adventure
    ADD uuid VARCHAR NOT NULL;

ALTER TABLE adventure
    ADD CONSTRAINT adventure_uuid_unique
    UNIQUE (uuid);
