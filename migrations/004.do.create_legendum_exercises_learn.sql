CREATE TABLE legendum_exercises_learn (
    id SERIAL PRIMARY KEY,
    exercise_id INTEGER
        REFERENCES legendum_exercises(id) ON DELETE CASCADE NOT NULL,
    page INTEGER NOT NULL,
    text TEXT NOT NULL,
    image_url TEXT,
    image_alt_text TEXT,
    background_image_url TEXT,
    background_image_alt_text TEXT
);