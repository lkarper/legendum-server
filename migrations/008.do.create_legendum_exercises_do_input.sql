CREATE TABLE legendum_exercises_do_input (
    id SERIAL PRIMARY KEY,
    question_id INTEGER 
        REFERENCES legendum_exercises_do(id) ON DELETE CASCADE NOT NULL,
    question TEXT NOT NULL,
    input_label TEXT,
    correct_response TEXT,
    response_if_incorrect TEXT,
    look_ahead BOOLEAN,
    look_back BOOLEAN,
    property_to_save TEXT,
    property_to_look_for TEXT, 
    image_url TEXT,
    image_alt_text TEXT
);