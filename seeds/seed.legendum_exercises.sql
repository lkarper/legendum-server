BEGIN;

TRUNCATE
    legendum_exercises
    RESTART IDENTITY CASCADE;

SET CLIENT_ENCODING to 'utf8';

INSERT INTO legendum_exercises (exercise_title, chapter_number, exercise_translation)
VALUES 
    ('Exercitium prīmum: Salūtātiōnēs', 1, '(Exercise one: Greetings)'),
    ('Exercitium Secundum: Ubī est...?', 2, '(Exercise two: Where is...?)');

COMMIT;
