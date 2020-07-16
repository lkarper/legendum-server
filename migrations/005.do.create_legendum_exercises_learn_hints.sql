CREATE TABLE legendum_exercises_learn_hints (
    id SERIAL PRIMARY KEY,
    exercise_page_id INTEGER
        REFERENCES legendum_exercises_learn(id) ON DELETE CASCADE NOT NULL,
    hint_order_number INTEGER NOT NULL,
    hint TEXT NOT NULL
);