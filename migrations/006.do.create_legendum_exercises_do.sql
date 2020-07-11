CREATE TYPE question_category AS ENUM (
    'multiple-choice',
    'input',
    'true/false'
);

CREATE TABLE legendum_exercises_do (
    id SERIAL PRIMARY KEY,
    exercise_id INTEGER
        REFERENCES legendum_exercises(id) ON DELETE CASCADE NOT NULL,
    page INTEGER NOT NULL,
    dialogue TEXT,
    dialogue_look_back BOOLEAN,
    dialogue_to_look_for TEXT,
    question_type question_category
);