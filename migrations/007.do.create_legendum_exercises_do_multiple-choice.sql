CREATE TABLE legendum_exercises_do_multiple_choice (
    id SERIAL PRIMARY KEY,
    question_id INTEGER 
        REFERENCES legendum_exercises_do(id) ON DELETE CASCADE NOT NULL,
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
    image_alt_text TEXT
);