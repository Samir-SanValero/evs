-- REQUIRED INITIAL DATA
    -- Admin user
        INSERT IGNORE INTO EVS.user (id, role, username, password) VALUES (1, 'ROLE_ADMIN', 'admin', '$2b$09$tEEAIARrQjSY.TcCdTHtPeysu6DREWDpegb2QBkSPuNJ.dlDAoHAW');
        INSERT IGNORE INTO EVS.user (id, role, username, password) VALUES (2, 'ROLE_USER', 'normal', '$2b$09$tEEAIARrQjSY.TcCdTHtPeysu6DREWDpegb2QBkSPuNJ.dlDAoHAW');

    -- INSEMINATION_TYPE
        INSERT IGNORE INTO EVS.insemination_type (name) VALUES
            ('Intracervical Insemination'),
            ('Intrauterine Insemination'),
            ('Intrauterine Tuboperitoneal Insemination'),
            ('Intratubal Insemination');

    -- EMBRYO_STATUS
        INSERT IGNORE INTO EVS.embryo_status(color, name, description) VALUES
            ('#90ee90', 'valid', 'Transfer'),
            ('#87cefa', 'freeze', 'Cryopreservation'),
            ('#cd5c5c', 'discard', 'Discard'),
            ('#f0e68c', 'undecided', 'Observation'),
            ('#ffffff', 'unselected', 'No status');

    -- BASE TAGS
        INSERT IGNORE INTO tag (id, acronym, comment, description, end, name, score, start, time, type, repeatable) VALUES
             (1, '1C',  '', 'One cell visible', null, 'One cell', null, null, null, 'BASE', false),
             (2, '2C',  '', 'Two cells visible', null, 'Two cells', null, null, null, 'BASE', false),
             (3, '3C',  '', 'Three cells visible', null, 'Three Cells', null, null, null, 'BASE', false),
             (4, '4C',  '', 'Four cells visible', null, 'Four cells', null, null, null, 'BASE', false),
             (5, '5C',  '', 'Five cells visible', null, 'Five cells', null, null, null, 'BASE', false),
             (6, '6C',  '', 'Six cells visible', null, 'Six cells', null, null, null, 'BASE', false),
             (7, '7C',  '', 'Seven cells visible', null, 'Seven cells', null, null, null, 'BASE', false),
             (8, '8C',  '', 'Eight cells visible', null, 'Eight cells', null, null, null, 'BASE', false),
             (9, '9C',  '', 'Nine cells visible', null, 'Nine cells', null, null, null, 'BASE', false),
             (10, '9C+',  'Nine or more cells', 'Nine or more cells visible', null, 'Nine or more cells', null, null, null, 'BASE', false),
--              (11, 'Hinbgl',  '', '', null, '1C', null, null, null, 'BASE', false),
             (12 ,'2PBe',  '', 'Embryo shows Polar body extrusion', null, 'Polar body extrusion', null, null, null, 'BASE', true),
             (13, 'aPN',  '', 'If the protonuclei are visible', null, 'Protonuclei appearance', null, null, null, 'BASE', true),
             (14, 'fPN',  '', 'If the protonuclei has faded away', null, 'Protonuclei fade', null, null, null, 'BASE', true),
             (15, 'TE',  '', 'If the trophectoderm has faded away', null, 'Tropectoderm', null, null, null, 'BASE', true),
             (16, 'CH',  '', 'If the embryo shows a cytoplasmic halo', null, 'Cytoplasmic Halo', null, null, null, 'BASE', true),
             (17, 'SER',  '', 'If the embryo shows smooth endoplasmic reticulum aggregates', null, 'Smooth endoplasmic reticulum aggregates', null, null, null, 'BASE', true),
             (18, 'IMG-T',  'Select to put text in image', 'Select to put text in image', null, 'Text annotation', null, null, null, 'BASE', true),
             (19, 'IMG-A',  'Select to point in image', 'Select to point in image', null, 'Arrow annotation', null, null, null, 'BASE', true),
             (20, 'IMG-C',  'Select to draw circle in image', 'Select to draw circle in image', null, 'Circle annotation', null, null, null, 'BASE', true),
             (21, 'IMG-L',  'Select to draw line in image', 'Select to draw line in image', null, 'Line annotation', null, null, null, 'BASE', true),
             (22, 'Event',  'Morphological event', 'Indicates a morphological event', null, 'Event', null, null, null, 'BASE', true);

-- USER INPUT SIMULATION DATA
    -- MODELS
        INSERT IGNORE INTO model (name) VALUES
            ('Default model'),
            ('Embryotools model'),
            ('Fenomatch model');

        INSERT IGNORE INTO tag (id, acronym, comment, description, end, name, score, start, time, type, repeatable) VALUES
    -- MODEL 1 TAGS
            (22, '1C',  'One cell', 'One cell visible', 86400, '1C', 3, 80400, null, 'MODEL', false),
            (23, '2C',  'Two Cells', 'Two cells visible', 106400, '1C', 6, 100400, null, 'MODEL', false),
            (24, '3C',  'Smooth endoplasmic reticulum aggregates', 'If the embryo shows a cytoplasmic halo', 126400, '1C', 7, 106400, null, 'MODEL', false),
            (25, '4C',  'Four Cells', 'Four cells visible', 156400, '1C', 1, 126400, null, 'MODEL', false),
            (26, '5C',  'Five Cells', 'Five cells visible', 186400, '1C', 13, 146400, null, 'MODEL', false),
            (27, '6C',  'Six Cells', 'Six cells visible', 206400, '1C', 2, 156400, null, 'MODEL', false),
            (28, '7C',  'Seven Cells', 'Seven cells visible', 226400, '1C', 2, 126400, null, 'MODEL', false),
            (29, 'aPN',  'Protonuclei appearance', 'If the protonuclei is visible', 6400, '1C', 8, 2400, null, 'MODEL', false),

    -- MODEL 2 TAGS
            (30, '1C',  'One cell', 'One cell visible', 86400, '1C', 1, 80400, null, 'MODEL', false),
            (31, '2C',  'Two Cells', 'Two cells visible', 106400, '1C', 1, 100400, null, 'MODEL', false),
            (32, '3C',  'Smooth endoplasmic reticulum aggregates', 'If the embryo shows a cytoplasmic halo', 126400, '1C', 3, 106400, null, 'MODEL', false),
            (33, '4C',  'Four Cells', 'Four cells visible', 156400, '1C', 4, 126400, null, 'MODEL', false),
            (34, '5C',  'Five Cells', 'Five cells visible', 186400, '1C', 2, 146400, null, 'MODEL', false),
            (35, '6C',  'Six Cells', 'Six cells visible', 206400, '1C', 7, 156400, null, 'MODEL', false),
            (36, '7C',  'Seven Cells', 'Seven cells visible', 226400, '1C', 2, 126400, null, 'MODEL', false),
            (37, 'aPN',  'Protonuclei appearance', 'If the protonuclei is visible', 6400, '1C', 1, 2400, null, 'MODEL', false),

    -- MODEL 3 TAGS
            (30, '1C',  'One cell', 'One cell visible', 86400, '1C', 1, 80400, null, 'MODEL', false),
            (31, '7C',  'Seven Cells', 'Seven cells visible', 226400, '1C', 5, 126400, null, 'MODEL', false),
            (32, 'aPN',  'Protonuclei appearance', 'If the protonuclei is visible', 6400, '1C', 3, 2400, null, 'MODEL', false);

        INSERT IGNORE INTO model_tags (model_id, tags_id) VALUES
            (1, 22),
            (1, 23),
            (1, 24),
            (1, 25),
            (1, 26),
            (1, 27),
            (1, 28),
            (1, 29),

            (2, 30),
            (2, 31),
            (2, 32),
            (2, 33),
            (2, 34),
            (2, 35),
            (2, 36),
            (2, 37),

            (3, 30),
            (3, 31),
            (3, 32);

-- MORPHOLOGICAL EVENTS
    -- BASE EVENTS
        INSERT IGNORE INTO morphological_event (id, acronym, name, description, type) VALUES
            (1, 'S',  'Size', 'Size of PB', 'BASE'),
            (2, 'I',  'Integrity', 'Integrity of PB', 'BASE'),
            (3, 'PN-S',  'Protonucleus size', 'Size of Protonucleus', 'BASE'),
            (4, 'PN-L',  'Protonucleus Location', 'Protonucleus Location', 'BASE'),
            (5, 'PN-A',  'Protonucleus alignment', 'Protonucleus alignment', 'BASE'),
            (6, 'PN-NS',  'Nucleoli size', 'Nucleoli size', 'BASE'),
            (7, 'PN-ND',  'Nucleoli distribution', 'Nucleoli distribution', 'BASE'),
            (8, 'PN-CH',  'Cytoplasmic halo', 'Cytoplasmic halo', 'BASE'),
            (9, 'PN-V',  'Vacuolization', 'Vacuolization', 'BASE'),
            (10, 'PN-SER',  'Smooth endoplasmic reticulum aggregates', 'Smooth endoplasmic reticulum aggregates', 'BASE'),
            (11, 'PN-CG',  'Cortical granules', 'Cortical granules', 'BASE'),
            (12, 'PN-ZP',  'Zona Pellucida', 'Zona Pellucida', 'BASE'),
            (13, 'PN-PS',  'Perivitelline space', 'Perivitelline space', 'BASE'),
            (14, 'PN-N',  'Protonucleus number', 'Number of Protonucleus', 'BASE'),
            (15, 'E-S',  'Embryo symmetry', 'Embryo symmetry', 'BASE'),
            (16, 'E-F',  'Embryo fragmentation', 'Embryo fragmentation', 'BASE'),
            (17, 'E-D',  'Embryo division', 'Embryo division', 'BASE'),
            (18, 'E-MN',  'Embryo multinucleation', 'Embryo multinucleation', 'BASE'),
            (19, 'E-C',  'Embryo compaction', 'Embryo compaction', 'BASE'),
            (20, 'E-CT',  'Embryo compaction type', 'Embryo compaction type', 'BASE'),
            (21, 'E-EC',  'Embryo excluded cells', 'Embryo excluded cells', 'BASE'),
            (22, 'E-ICM',  'Embryo Inner Cell Mass', 'Embryo Inner Cell Mass', 'BASE'),
            (23, 'E-TP',  'Embryo Tropectoderm', 'Embryo Tropectoderm', 'BASE'),
            (24, 'E-EX',  'Embryo expansion', 'Embryo expansion', 'BASE'),
            (25, 'E-CS',  'Embryo collapse', 'Embryo collapse', 'BASE');

        INSERT IGNORE INTO morphological_event_options (morphological_event_id, options) VALUES
        -- 2PB extrusion
            (1, 'Normal'),
            (1, 'Abormal'),

            (2, 'Normal'),
            (2, 'Fragmented'),
            (2, 'Degenerated'),

        -- aPN
            (3, 'Even'),
            (3, 'Uneven'),

            (4, 'Central'),
            (4, 'Displaced'),

            (5, 'Close'),
            (5, 'Separated'),

            (6, 'Even'),
            (6, 'Uneven'),

            (7, 'Scattered'),
            (7, 'Aligned'),

            (8, 'Size +'),
            (8, 'Size ++'),
            (8, 'Size +++'),

            (9, 'Yes'),
            (9, 'No'),

            (10, 'Yes'),
            (10, 'No'),

            (11, 'Yes(+)'),
            (11, 'Yes(++)'),
            (11, 'Yes(+++)'),
            (11, 'No'),

            (12, 'Irregular'),
            (12, 'Thin'),
            (12, 'Normal'),

            (13, 'Yes (+)'),
            (13, 'Yes (++)'),
            (13, 'Normal'),

            (14, '1'),
            (14, '2'),
            (14, '3'),
            (14, '>4'),

        -- General events
            -- Embryo symmetry
            (15, 'Even'),
            (15, 'Uneven'),

            -- Embryo fragmentation
            (16, '<5%'),
            (16, '5-10%'),
            (16, '10-15%'),
            (16, '15-20%'),
            (16, '>20%'),

            -- Embryo division
            (17, 'Regular'),
            (17, 'Irregular'),

            -- Embryo division
            (18, 'No'),
            (18, 'Yes (1:2)'),
            (18, 'Yes (2:2)'),

            -- Embryo compaction
            (19, '0'),
            (19, '1'),
            (19, '2'),
            (19, '3'),

            -- Embryo compaction type
            (20, 'Partial'),
            (20, 'Total'),

            -- Embryo excluded cells
            (21, 'No'),
            (21, '1'),
            (21, '2'),
            (21, '3+'),

            -- Embryo Inner Cell Mass (ICM)
            (22, 'A'),
            (22, 'B'),
            (22, 'C'),
            (22, 'D'),

            -- Embryo Tropectoderm
            (23, 'A'),
            (23, 'B'),
            (23, 'C'),
            (23, 'D'),

            -- Accumulated Embryo Expansions
            (24, '1'),
            (24, '2'),
            (24, '3'),
            (24, '4'),
            (24, '5'),

            -- Accumulated Embryo Collapses
            (25, '1'),
            (25, '2'),
            (25, '3'),
            (25, '4'),
            (25, '5');

        INSERT IGNORE INTO tag_morphological_events (tag_id, morphological_events_id) VALUES
        -- 2PB extrusion
            (12, 1),
            (12, 2),
        -- aPNs
            (13, 3),
            (13, 4),
            (13, 5),
            (13, 6),
            (13, 7),
            (13, 8),
            (13, 9),
            (13, 10),
            (13, 11),
            (13, 12),
            (13, 13),
            (13, 14),

        -- Events
            (22, 15),
            (22, 16),
            (22, 17),
            (22, 18),
            (22, 19),

            (22, 20),
            (22, 21),
            (22, 22),
            (22, 23),
            (22, 24);

-- EMBRYO PHASES
    INSERT IGNORE INTO phase (id, acronym, name, start_time, end_time, type) VALUES
        -- BASE PHASES
        (1, 'Z', 'Zygote', '', '', 'BASE'),
        (2, 'EC', 'Early-Cleavage', '', '', 'BASE'),
        (3, 'C-2C', 'Cleavage Two Cells', '', '', 'BASE'),
        (4, 'C-3C', 'Cleavage Three Cells', '', '', 'BASE'),
        (5, 'C-4C', 'Cleavage Four Cells', '', '', 'BASE'),
        (6, 'C-5C', 'Cleavage Five Cells', '', '', 'BASE'),
        (7, 'C-6C', 'Cleavage Six Cells', '', '', 'BASE'),
        (8, 'C-7C', 'Cleavage Seven Cells', '', '', 'BASE'),
        (9, 'M', 'Morula', '', '', 'BASE'),
        (10, 'CO-M', 'Compacted Morula', '', '', 'BASE'),
        (11, 'CA-M', 'Cavitating Morula', '', '', 'BASE'),
        (12, 'ER-B', 'Early Blastocyst', '', '', 'BASE'),
        (13, 'B', 'Blastocyst', '', '', 'BASE'),
        (14, 'EX-B', 'Expanded Blastocyst', '', '', 'BASE');

# -- PARTNER_DATA
#     INSERT INTO EVS.partner_data (comment, name) VALUES
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'John Doe 1'),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'John Doe 2'),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'John Doe 3'),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'John Doe 4'),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'John Doe 5'),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'John Doe 6'),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'John Doe 7'),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'John Doe 8'),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'John Doe 9'),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', 'John Doe 10');
#
#
#
# -- INSEMINATION_DATA
#     INSERT INTO EVS.insemination_data (comment, insemination_date, type_id) VALUES
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '2020-08-15', 1),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '2020-08-25', 2),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '2020-08-15', 3),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '2020-08-25', 4),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '2020-08-15', 2),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '2020-08-25', 1),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '2020-08-15', 2),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '2020-08-25', 1),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '2020-08-15', 3),
#     ('Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry''s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.', '2020-08-25', 2);
#
#
# -- PATIENT_DATA
#     INSERT INTO EVS.patient_data (added_information, comment, dish, name, photo) VALUES
#     ('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '1', 'Jane Doe', null),
#     ('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '2', 'Jane Doe 2', NULL),
#     ('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '3', 'Jane Doe 3', NULL),
#     ('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '4', 'Jane Doe 4', NULL),
#     ('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '5', 'Jane Doe 5', NULL),
#     ('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '6', 'Jane Doe 6', NULL),
#     ('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '7', 'Jane Doe 7', NULL),
#     ('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '8', 'Jane Doe 8', NULL),
#     ('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '9', 'Jane Doe 9', NULL),
#     ('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', '10', 'Jane Doe 10', NULL);
#
#
# -- PATIENT
#     INSERT INTO EVS.patient (insemination_data_id, partner_data_id, patient_data_id) VALUES
#     (1, 1, 1),
#     (2, 2, 2),
#     (3, 3, 3),
#     (4, 4, 4),
#     (5, 5, 5),
#     (6, 6, 6),
#     (7, 7, 7),
#     (8, 8, 8),
#     (9, 9, 9),
#     (10, 10, 10);
#
#
#
# -- EMBRYOS
#     INSERT INTO EVS.embryo (dish_location_number, selected, status_id, insemination_date, embryos_id, photo_folder) VALUES
#     (1, true, 1, '2020-08-08 16:30:52', 1, '/home/jpg/projects/imageDataSet/D2000.01.01_S0109_I000_WELL01/'),
#     (2, false, 4, '2020-08-08 16:30:52', 1, '/home/jpg/projects/imageDataSet/D2000.01.01_S0109_I000_WELL02/'),
#
#     (3, false, 5, '2020-08-08 16:30:52', 1, '/home/jpg/projects/imageDataSet/D2000.01.01_S0109_I000_WELL03/'),
#     (4, false, 5, '2020-08-08 16:30:52', 1, '/home/jpg/projects/imageDataSet/D2000.01.01_S0110_I000_WELL04/'),
#     (5, false, 2, '2020-08-08 16:30:52', 1, '/home/jpg/projects/imageDataSet/D2000.01.01_S0109_I000_WELL05/'),
#     (6, false, 3, '2020-08-08 16:30:52', 1, '/home/jpg/projects/imageDataSet/D2000.01.01_S0109_I000_WELL06/'),
#
#     (7, false, 5, '2020-08-08 16:30:52', 1, '/home/jpg/projects/imageDataSet/D2000.01.01_S0109_I000_WELL07/'),
#     (8, false, 5, '2020-08-08 16:30:52', 1, '/home/jpg/projects/imageDataSet/D2000.01.01_S0109_I000_WELL08/'),
#     (9, false, 3, '2020-08-08 16:30:52', 1, '/home/jpg/projects/imageDataSet/D2000.01.01_S0110_I000_WELL08/'),
#     (10, false, 5, '2020-08-08 16:30:52', 1, '/home/jpg/projects/imageDataSet/D2000.01.01_S0110_I000_WELL10/'),
#
#     (11, false, 5, '2020-08-08 16:30:52', 1, '/home/jpg/projects/imageDataSet/D2000.01.01_S0110_I000_WELL11/'),
#     (12, false, 5, '2020-08-08 16:30:52', 1, '/home/jpg/projects/imageDataSet/D2000.01.01_S0110_I000_WELL04/'),
#
#     (1, true, 2, '2020-08-08 20:30:52', 2, null),
#     (2, false, 4, '2020-08-08 20:30:52', 2, null),
#
#     (3, false, 1, '2020-08-08 20:30:52', 2, null),
#     (4, false, 2, '2020-08-08 20:30:52', 2, null),
#     (5, false, 5, '2020-08-08 20:30:52', 2, null),
#     (6, false, 3, '2020-08-08 20:30:52', 2, null),
#
#     (7, false, 5, '2020-08-08 20:30:52', 2, null),
#     (8, false, 4, '2020-08-08 20:30:52', 2, null),
#     (9, false, 5, '2020-08-08 20:30:52', 2, null),
#     (10, false, 2, '2020-08-08 20:30:52', 2, null),
#
#     (11, false, 2, '2020-08-08 20:30:52', 2, null),
#     (12, false, 5, '2020-08-08 20:30:52', 2, null),
#
#     (1, false, 1, '2020-08-08 20:30:52', 3, null),
#     (2, false, 4, '2020-08-08 20:30:52', 3, null),
#
#     (3, false, 5, '2020-08-08 20:30:52', 3, null),
#     (4, false, 5, '2020-08-08 20:30:52', 3, null),
#     (5, false, 2, '2020-08-08 20:30:52', 3, null),
#     (6, true, 3, '2020-08-08 20:30:52', 3, null),
#
#     (7, false, 5, '2020-08-08 20:30:52', 3, null),
#     (8, false, 5, '2020-08-08 20:30:52', 3, null),
#     (9, false, 3, '2020-08-08 20:30:52', 3, null),
#     (10, false, 5, '2020-08-08 20:30:52', 3, null),
#
#     (11, false, 5, '2020-08-08 20:30:52', 3, null),
#     (12, false, 1, '2020-08-08 20:30:52', 3, null),
#
#     (1, false, 2, '2020-08-08 20:30:52', 4, null),
#     (2, false, 4, '2020-08-08 20:30:52', 4, null),
#
#     (3, false, 1, '2020-08-08 20:30:52', 4, null),
#     (4, false, 2, '2020-08-08 20:30:52', 4, null),
#     (5, false, 5, '2020-08-08 20:30:52', 4, null),
#     (6, false, 3, '2020-08-08 20:30:52', 4, null),
#
#     (7, false, 5, '2020-08-08 20:30:52', 4, null),
#     (8, false, 4, '2020-08-08 20:30:52', 4, null),
#     (9, false, 4, '2020-08-08 20:30:52', 4, null),
#     (10, false, 2, '2020-08-08 20:30:52', 4, null),
#
#     (11, false, 2, '2020-08-08 20:30:52', 4, null),
#     (12, true, 5, '2020-08-08 20:30:52', 4, null),
#
#     (1, false, 1, '2020-08-08 20:30:52', 5, null),
#     (2, false, 4, '2020-08-08 20:30:52', 5, null),
#
#     (3, false, 5, '2020-08-08 20:30:52', 5, null),
#     (4, false, 5, '2020-08-08 20:30:52', 5, null),
#     (5, false, 2, '2020-08-08 20:30:52', 5, null),
#     (6, false, 3, '2020-08-08 20:30:52', 5, null),
#
#     (7, false, 2, '2020-08-08 20:30:52', 5, null),
#     (8, false, 5, '2020-08-08 20:30:52', 5, null),
#     (9, true, 3, '2020-08-08 20:30:52', 5, null),
#     (10, false, 4, '2020-08-08 20:30:52', 5, null),
#
#     (11, false, 5, '2020-08-08 20:30:52', 5, null),
#     (12, false, 1, '2020-08-08 20:30:52', 5, null),
#
#     (1, false, 2, '2020-08-08 20:30:52', 6, null),
#     (2, true, 4, '2020-08-08 20:30:52', 6, null),
#
#     (3, false, 1, '2020-08-08 20:30:52', 6, null),
#     (4, false, 2, '2020-08-08 20:30:52', 6, null),
#     (5, false, 3, '2020-08-08 20:30:52', 6, null),
#     (6, false, 3, '2020-08-08 20:30:52', 6, null),
#
#     (7, false, 2, '2020-08-08 20:30:52', 6, null),
#     (8, false, 4, '2020-08-08 20:30:52', 6, null),
#     (9, false, 5, '2020-08-08 20:30:52', 6, null),
#     (10, false, 2, '2020-08-08 20:30:52', 6, null),
#
#     (11, false, 2, '2020-08-08 20:30:52', 6, null),
#     (12, false, 4, '2020-08-08 20:30:52', 6, null),
#
#     (1, false, 1, '2020-08-08 20:30:52', 7, null),
#     (2, false, 4, '2020-08-08 20:30:52', 7, null),
#
#     (3, true, 5, '2020-08-08 20:30:52', 7, null),
#     (4, false, 1, '2020-08-08 20:30:52', 7, null),
#     (5, false, 2, '2020-08-08 20:30:52', 7, null),
#     (6, false, 3, '2020-08-08 20:30:52', 7, null),
#
#     (7, false, 5, '2020-08-08 20:30:52', 7, null),
#     (8, false, 2, '2020-08-08 20:30:52', 7, null),
#     (9, false, 3, '2020-08-08 20:30:52', 7, null),
#     (10, false, 5, '2020-08-08 20:30:52', 7, null),
#
#     (11, false, 5, '2020-08-08 20:30:52', 7, null),
#     (12, false, 5, '2020-08-08 20:30:52', 7, null),
#
#     (1, false, 2, '2020-08-08 20:30:52', 8, null),
#     (2, false, 4, '2020-08-08 20:30:52', 8, null),
#
#     (3, false, 1, '2020-08-08 20:30:52', 8, null),
#     (4, false, 2, '2020-08-08 20:30:52', 8, null),
#     (5, false, 4, '2020-08-08 20:30:52', 8, null),
#     (6, false, 3, '2020-08-08 20:30:52', 8, null),
#
#     (7, true, 1, '2020-08-08 20:30:52', 8, null),
#     (8, false, 4, '2020-08-08 20:30:52', 8, null),
#     (9, false, 3, '2020-08-08 20:30:52', 8, null),
#     (10, false, 2, '2020-08-08 20:30:52', 8, null),
#
#     (11, false, 2, '2020-08-08 20:30:52', 8, null),
#     (12, false, 5, '2020-08-08 20:30:52', 8, null),
#
#     (1, false, 1, '2020-08-08 20:30:52', 9, null),
#     (2, false, 4, '2020-08-08 20:30:52', 9, null),
#
#     (3, false, 5, '2020-08-08 20:30:52', 9, null),
#     (4, false, 1, '2020-08-08 20:30:52', 9, null),
#     (5, false, 2, '2020-08-08 20:30:52', 9, null),
#     (6, false, 3, '2020-08-08 20:30:52', 9, null),
#
#     (7, true, 5, '2020-08-08 20:30:52', 9, null),
#     (8, false, 1, '2020-08-08 20:30:52', 9, null),
#     (9, false, 3, '2020-08-08 20:30:52', 9, null),
#     (10, false, 5, '2020-08-08 20:30:52', 9, null),
#
#     (11, false, 5, '2020-08-08 20:30:52', 9, null),
#     (12, false, 4, '2020-08-08 20:30:52', 9, null),
#
#     (1, false, 2, '2020-08-08 20:30:52', 10, null),
#     (2, false, 4, '2020-08-08 20:30:52', 10, null),
#
#     (3, false, 1, '2020-08-08 20:30:52', 10, null),
#     (4, false, 2, '2020-08-08 20:30:52', 10, null),
#     (5, false, 4, '2020-08-08 20:30:52', 10, null),
#     (6, false, 3, '2020-08-08 20:30:52', 10, null),
#
#     (7, false, 5, '2020-08-08 20:30:52', 10, null),
#     (8, false, 4, '2020-08-08 20:30:52', 10, null),
#     (9, false, 2, '2020-08-08 20:30:52', 10, null),
#     (10, true, 2, '2020-08-08 20:30:52', 10, null),
#
#     (11, false, 2, '2020-08-08 20:30:52', 10, null),
#     (12, false, 5, '2020-08-08 20:30:52', 10, null);
#
# -- TAGS
#
#     -- EMBRYO 2 TAGS
#         ('1C',  'One cell', 'One cell visible', null, '1C', null, null, 12000, 'EMBRYO'),
#         ('2C',  'Two Cells', 'Two cells visible', null, '1C', null, null, 25000, 'EMBRYO'),
#         ('aPN',  'Protonuclei appearance', 'If the protonuclei is visible', null, '1C', null, null, 3500, 'EMBRYO'),
#
#     -- EMBRYO 3 TAGS
#         ('aPN',  'Protonuclei appearance', 'If the protonuclei is visible', null, '1C', null, null, 1200, 'EMBRYO');
#
#
#     INSERT INTO embryo_tags (embryo_id, tags_id) VALUES
#     (1, 19),
#     (1, 20),
#     (1, 21),
#     (1, 22),
#     (1, 23),
#     (1, 24),
#     (1, 25),
#     (1, 26),
#
#     (2, 46),
#     (2, 47),
#     (2, 48),
#
#     (3, 49);
#
#
#       -- EMBRYO 1 TAGS
#             ('1C',  'One cell', 'One cell visible', null, '1C', null, null, 8000, 'EMBRYO'),
#             ('2C',  'Two Cells', 'Two cells visible', null, '1C', null, null, 12000, 'EMBRYO'),
#             ('3C',  'Smooth endoplasmic reticulum aggregates', 'If the embryo shows a cytoplasmic halo', null, '1C', null, null, 15500, 'EMBRYO'),
#             ('4C',  'Four Cells', 'Four cells visible', null, '1C', null, null, 17500, 'EMBRYO'),
#             ('5C',  'Five Cells', 'Five cells visible', null, '1C', null, null, 24000, 'EMBRYO'),
#             ('6C',  'Six Cells', 'Six cells visible', null, '1C', null, null, 35000, 'EMBRYO'),
#             ('7C',  'Seven Cells', 'Seven cells visible', null, '1C', null, null, 42000, 'EMBRYO'),
#             ('aPN',  'Protonuclei appearance', 'If the protonuclei is visible', null, '1C', null, null, 3600, 'EMBRYO'),
