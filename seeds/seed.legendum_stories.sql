BEGIN;

TRUNCATE
    legendum_stories
    RESTART IDENTITY CASCADE;

INSERT INTO legendum_stories (title)
VALUES
    ('Initium');

COMMIT;