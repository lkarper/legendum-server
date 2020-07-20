BEGIN;

TRUNCATE
    legendum_exercises
    RESTART IDENTITY CASCADE;

SET CLIENT_ENCODING to 'utf8';

INSERT INTO legendum_exercises (exercise_title, exercise_translation)
VALUES 
    ('Exercitium prīmum: Salūtātiōnēs', '(Exercise one: Greetings)'),
    ('Exercitium Secundum: Ubī est...?', '(Exercise two: Where is...?)');

COMMIT;