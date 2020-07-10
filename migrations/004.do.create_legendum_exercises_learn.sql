CREATE TABLE legendum_exercises_learn (
    id SERIAL PRIMARY KEY,
    exercise_id INTEGER
        REFERENCES legendum_exercises(id) ON DELETE CASCADE NOT NULL,
    page INTEGER NOT NULL UNIQUE,
    text TEXT NOT NULL,
    image_url TEXT,
    image_alt_text TEXT
);