BEGIN;

TRUNCATE
    legendum_stories
    RESTART IDENTITY CASCADE;

INSERT INTO legendum_stories (story_title)
VALUES
    ('Initium'),
    ('Adventus');

COMMIT;