BEGIN;

TRUNCATE
    legendum_stories
    RESTART IDENTITY CASCADE;

INSERT INTO legendum_stories (story_title, chapter_number)
VALUES
    ('Initium', 1),
    ('Adventus', 2);

COMMIT;
