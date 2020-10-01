CREATE TABLE legendum_exercises (
    id SERIAL PRIMARY KEY,
    chapter_number INTEGER 
        REFERENCES legendum_stories(chapter_number) ON DELETE CASCADE NOT NULL,
    exercise_title TEXT NOT NULL,
    exercise_translation TEXT NOT NULL
);