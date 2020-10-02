CREATE TYPE question_category AS ENUM (
    'multiple-choice',
    'input',
    'true/false'
);

CREATE TABLE legendum_exercises_do (
    id SERIAL PRIMARY KEY,
    chapter_number INTEGER
        REFERENCES legendum_exercises(chapter_number) ON DELETE CASCADE NOT NULL,
    page INTEGER NOT NULL,
    dialogue TEXT,
    dialogue_look_back BOOLEAN,
    dialogue_to_look_for TEXT,
    question_type question_category NOT NULL,
    question TEXT NOT NULL,
    incorrect_response_option_1 TEXT,
    incorrect_response_option_2 TEXT,
    incorrect_response_option_3 TEXT,
    correct_response TEXT,
    response_if_incorrect_1 TEXT,
    response_if_incorrect_2 TEXT,
    response_if_incorrect_3 TEXT,
    look_ahead BOOLEAN,
    look_back BOOLEAN,
    property_to_save TEXT,
    property_to_look_for TEXT, 
    image_url TEXT,
    image_alt_text TEXT,
    input_label TEXT,
    background_image_url TEXT,
    background_image_alt_text TEXT
);