ALTER TABLE universe
    DROP COLUMN id;

ALTER TABLE universe
    ADD code VARCHAR NOT NULL;

ALTER TABLE universe
    ADD CONSTRAINT universe_pk UNIQUE (code);

ALTER TABLE adventure
    ADD universe_code VARCHAR;

ALTER TABLE adventure
    ADD CONSTRAINT adventure_universe_code_fk
        FOREIGN KEY (universe_code) REFERENCES universe (code);

ALTER TABLE universe
    ADD icon VARCHAR DEFAULT null;