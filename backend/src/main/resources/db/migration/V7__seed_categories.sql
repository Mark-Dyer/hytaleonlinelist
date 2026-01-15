INSERT INTO categories (id, name, slug, description, icon) VALUES
    (gen_random_uuid(), 'Survival', 'survival', 'Classic survival gameplay with resource gathering and building', 'shield'),
    (gen_random_uuid(), 'PvP', 'pvp', 'Player versus player combat servers', 'swords'),
    (gen_random_uuid(), 'Creative', 'creative', 'Building and creativity focused servers', 'brush'),
    (gen_random_uuid(), 'RPG', 'rpg', 'Role-playing game servers with quests and storylines', 'scroll'),
    (gen_random_uuid(), 'Minigames', 'minigames', 'Various mini-games and competitive modes', 'gamepad'),
    (gen_random_uuid(), 'Adventure', 'adventure', 'Story-driven adventure and exploration', 'map'),
    (gen_random_uuid(), 'Modded', 'modded', 'Servers with custom modifications and plugins', 'puzzle');
