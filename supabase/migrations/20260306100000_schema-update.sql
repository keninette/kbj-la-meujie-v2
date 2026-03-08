-- Adventure update
ALTER TABLE adventure
    ADD COLUMN IF NOT EXISTS uuid VARCHAR;

UPDATE adventure
SET uuid = CONCAT('adv-', id)
WHERE uuid IS NULL;

ALTER TABLE adventure
    ALTER COLUMN uuid SET NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'adventure_uuid_unique'
    ) THEN
        ALTER TABLE adventure
            ADD CONSTRAINT adventure_uuid_unique UNIQUE (uuid);
    END IF;
END
$$;

-- Adventure 1-n StoryArc
CREATE TABLE IF NOT EXISTS story_arc (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR NOT NULL UNIQUE,
    name VARCHAR NOT NULL,
    adventure_id BIGINT NOT NULL,
    CONSTRAINT story_arc_adventure_id_fk
        FOREIGN KEY (adventure_id) REFERENCES adventure (id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS story_arc_adventure_id_idx
    ON story_arc (adventure_id);

-- StoryArc 1-n Chapter
CREATE TABLE IF NOT EXISTS chapter (
    id BIGSERIAL PRIMARY KEY,
    uuid VARCHAR NOT NULL UNIQUE,
    name VARCHAR NOT NULL,
    story_arc_id BIGINT NOT NULL,
    CONSTRAINT chapter_story_arc_id_fk
        FOREIGN KEY (story_arc_id) REFERENCES story_arc (id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS chapter_story_arc_id_idx
    ON chapter (story_arc_id);

-- Step dependencies
CREATE TABLE IF NOT EXISTS place (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    public_description TEXT NOT NULL,
    private_description TEXT,
    picture JSONB,
    pin_id VARCHAR,
    is_step_bound BOOLEAN NOT NULL DEFAULT TRUE
);

-- Chapter 1-n Step, Step n-1 Place (optional)
CREATE TABLE IF NOT EXISTS step (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT NOT NULL,
    date VARCHAR,
    chapter_id BIGINT NOT NULL,
    place_id BIGINT,
    CONSTRAINT step_chapter_id_fk
        FOREIGN KEY (chapter_id) REFERENCES chapter (id)
        ON DELETE CASCADE,
    CONSTRAINT step_place_id_fk
        FOREIGN KEY (place_id) REFERENCES place (id)
        ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS step_chapter_id_idx
    ON step (chapter_id);

CREATE INDEX IF NOT EXISTS step_place_id_idx
    ON step (place_id);

-- Step 1-n Audio
CREATE TABLE IF NOT EXISTS audio (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    filename VARCHAR NOT NULL,
    loop BOOLEAN NOT NULL DEFAULT FALSE,
    auto_play BOOLEAN NOT NULL DEFAULT FALSE,
    volume NUMERIC NOT NULL DEFAULT 1,
    helper TEXT,
    step_id BIGINT NOT NULL,
    CONSTRAINT audio_step_id_fk
        FOREIGN KEY (step_id) REFERENCES step (id)
        ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS audio_step_id_idx
    ON audio (step_id);

-- Step 1-n Diceroll
CREATE TABLE IF NOT EXISTS diceroll (
    id BIGSERIAL PRIMARY KEY,
    dice VARCHAR NOT NULL,
    skill VARCHAR NOT NULL,
    on_success JSONB NOT NULL,
    on_failure JSONB NOT NULL,
    condition TEXT,
    step_id BIGINT NOT NULL,
    CONSTRAINT diceroll_step_id_fk
        FOREIGN KEY (step_id) REFERENCES step (id)
        ON DELETE CASCADE,
    CONSTRAINT diceroll_on_success_is_object_check
        CHECK (jsonb_typeof(on_success) = 'object'),
    CONSTRAINT diceroll_on_failure_is_object_check
        CHECK (jsonb_typeof(on_failure) = 'object')
);

CREATE INDEX IF NOT EXISTS diceroll_step_id_idx
    ON diceroll (step_id);

-- Step 1-n NonPlayerCharacter (DND or CTHULHU)
CREATE TABLE IF NOT EXISTS non_player_character (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    identifies_as VARCHAR NOT NULL,
    current_health_points INTEGER NOT NULL,
    max_health_points INTEGER NOT NULL,
    type VARCHAR NOT NULL DEFAULT 'NonPlayerCharacter',
    portrait VARCHAR,
    ruleset VARCHAR NOT NULL,

    -- DND fields
    character_class VARCHAR,
    level INTEGER,
    inspiration_points INTEGER,
    proficiency_bonus INTEGER,
    initiative_bonus INTEGER,
    armor_class INTEGER,
    race VARCHAR,
    alignment VARCHAR,

    -- CTHULHU fields
    backstory TEXT,
    occupation VARCHAR,
    current_magic_points INTEGER,
    max_magic_points INTEGER,
    current_san_points INTEGER,
    max_san_points INTEGER,

    step_id BIGINT NOT NULL,

    CONSTRAINT npc_step_id_fk
        FOREIGN KEY (step_id) REFERENCES step (id)
        ON DELETE CASCADE,
    CONSTRAINT npc_identifies_as_check
        CHECK (identifies_as IN ('Female', 'Male', 'Non-binary')),
    CONSTRAINT npc_type_check
        CHECK (type = 'NonPlayerCharacter'),
    CONSTRAINT npc_ruleset_check
        CHECK (ruleset IN ('DND', 'CTHULHU')),
    CONSTRAINT npc_ruleset_fields_check
        CHECK (
            (
                ruleset = 'DND'
                AND character_class IS NOT NULL
                AND level IS NOT NULL
                AND inspiration_points IS NOT NULL
                AND proficiency_bonus IS NOT NULL
                AND initiative_bonus IS NOT NULL
                AND armor_class IS NOT NULL
                AND race IS NOT NULL
                AND alignment IS NOT NULL
                AND current_magic_points IS NULL
                AND max_magic_points IS NULL
                AND current_san_points IS NULL
                AND max_san_points IS NULL
            )
            OR
            (
                ruleset = 'CTHULHU'
                AND character_class IS NULL
                AND level IS NULL
                AND inspiration_points IS NULL
                AND proficiency_bonus IS NULL
                AND initiative_bonus IS NULL
                AND armor_class IS NULL
                AND race IS NULL
                AND alignment IS NULL
                AND current_magic_points IS NOT NULL
                AND max_magic_points IS NOT NULL
                AND current_san_points IS NOT NULL
                AND max_san_points IS NOT NULL
            )
        )
);

CREATE INDEX IF NOT EXISTS npc_step_id_idx
    ON non_player_character (step_id);
