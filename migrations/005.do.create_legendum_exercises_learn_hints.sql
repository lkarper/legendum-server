CREATE TABLE legendum_exercises_learn_hints (
    id SERIAL PRIMARY KEY,
    exercise_page_id INTEGER
        REFERENCES legendum_exercises_learn(id) ON DELETE CASCADE NOT NULL,
    hints TEXT NOT NULL
);