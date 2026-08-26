DO $$
DECLARE
    v_adventure_id BIGINT;
    v_story_arc_id BIGINT;
    v_chapter_id BIGINT;
    v_place_id BIGINT;
    v_step_id BIGINT;
BEGIN
    INSERT INTO adventure (uuid, name, universe_code)
    VALUES (
        '11111111-1111-1111-1111-111111111111',
        'The Silent Harbor',
        'CTHULHU'
    )
    ON CONFLICT (uuid) DO UPDATE
    SET name = EXCLUDED.name,
        universe_code = EXCLUDED.universe_code
    RETURNING id INTO v_adventure_id;

    INSERT INTO story_arc (uuid, name, adventure_id)
    VALUES (
        '22222222-2222-2222-2222-222222222222',
        'Whispers Beneath The Pier',
        v_adventure_id
    )
    ON CONFLICT (uuid) DO UPDATE
    SET name = EXCLUDED.name,
        adventure_id = EXCLUDED.adventure_id
    RETURNING id INTO v_story_arc_id;

    INSERT INTO chapter (uuid, name, story_arc_id)
    VALUES (
        '33333333-3333-3333-3333-333333333333',
        'Chapter 1: Tidebound Signs',
        v_story_arc_id
    )
    ON CONFLICT (uuid) DO UPDATE
    SET name = EXCLUDED.name,
        story_arc_id = EXCLUDED.story_arc_id
    RETURNING id INTO v_chapter_id;

    SELECT id
    INTO v_place_id
    FROM place
    WHERE pin_id = 'arkham-dock-07'
    LIMIT 1;

    IF v_place_id IS NULL THEN
        INSERT INTO place (
            name,
            public_description,
            private_description,
            picture,
            pin_id,
            is_step_bound
        )
        VALUES (
            'Harbor Warehouse 7',
            'A damp warehouse lit by one swaying lamp and the smell of salt.',
            'A hidden hatch leads to a chamber etched with geometric carvings.',
            '{"name":"warehouse7","filename":"warehouse7.webp"}'::jsonb,
            'arkham-dock-07',
            TRUE
        )
        RETURNING id INTO v_place_id;
    ELSE
        UPDATE place
        SET name = 'Harbor Warehouse 7',
            public_description = 'A damp warehouse lit by one swaying lamp and the smell of salt.',
            private_description = 'A hidden hatch leads to a chamber etched with geometric carvings.',
            picture = '{"name":"warehouse7","filename":"warehouse7.webp"}'::jsonb,
            is_step_bound = TRUE
        WHERE id = v_place_id;
    END IF;

    SELECT id
    INTO v_step_id
    FROM step
    WHERE chapter_id = v_chapter_id
      AND name = 'Inspect The Sealed Crate'
    LIMIT 1;

    IF v_step_id IS NULL THEN
        INSERT INTO step (name, description, date, chapter_id, place_id)
        VALUES (
            'Inspect The Sealed Crate',
            'The investigators arrive at the warehouse and inspect a crate marked with unfamiliar runes.',
            '1925-10-31',
            v_chapter_id,
            v_place_id
        )
        RETURNING id INTO v_step_id;
    ELSE
        UPDATE step
        SET description = 'The investigators arrive at the warehouse and inspect a crate marked with unfamiliar runes.',
            date = '1925-10-31',
            place_id = v_place_id
        WHERE id = v_step_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM audio
        WHERE step_id = v_step_id
          AND filename = 'warehouse-ambience.mp3'
    ) THEN
        INSERT INTO audio (name, filename, loop, auto_play, volume, helper, step_id)
        VALUES (
            'Warehouse Ambience',
            'warehouse-ambience.mp3',
            TRUE,
            TRUE,
            0.65,
            'Play when the step starts.',
            v_step_id
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM diceroll
        WHERE step_id = v_step_id
          AND dice = '1d100'
          AND skill = 'Perception'
    ) THEN
        INSERT INTO diceroll (
            dice,
            skill,
            on_success,
            on_failure,
            condition,
            step_id
        )
        VALUES (
            '1d100',
            'Perception',
            '{"type":"CLUE","value":"You notice slime traces leading to the hatch."}'::jsonb,
            '{"type":"TEXT","value":"Nothing obvious stands out in the darkness."}'::jsonb,
            'Only if the crate has not been opened yet.',
            v_step_id
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM non_player_character
        WHERE step_id = v_step_id
          AND name = 'Eleanor Marsh'
          AND ruleset = 'CTHULHU'
    ) THEN
        INSERT INTO non_player_character (
            name,
            identifies_as,
            current_health_points,
            max_health_points,
            type,
            portrait,
            ruleset,
            backstory,
            occupation,
            current_magic_points,
            max_magic_points,
            current_san_points,
            max_san_points,
            step_id
        )
        VALUES (
            'Eleanor Marsh',
            'Female',
            10,
            10,
            'NonPlayerCharacter',
            'eleanor-marsh.webp',
            'CTHULHU',
            'A dock clerk who has seen strange shipments for months.',
            'Dock Clerk',
            6,
            6,
            47,
            55,
            v_step_id
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM non_player_character
        WHERE step_id = v_step_id
          AND name = 'Captain Voss'
          AND ruleset = 'DND'
    ) THEN
        INSERT INTO non_player_character (
            name,
            identifies_as,
            current_health_points,
            max_health_points,
            type,
            portrait,
            ruleset,
            character_class,
            level,
            inspiration_points,
            proficiency_bonus,
            initiative_bonus,
            armor_class,
            race,
            alignment,
            step_id
        )
        VALUES (
            'Captain Voss',
            'Male',
            22,
            22,
            'NonPlayerCharacter',
            'captain-voss.webp',
            'DND',
            'FIGHTER',
            4,
            1,
            2,
            2,
            16,
            'HUMAN',
            'LAWFUL_NEUTRAL',
            v_step_id
        );
    END IF;
END
$$;