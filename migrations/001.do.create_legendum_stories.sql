CREATE TABLE legendum_stories (
    id SERIAL PRIMARY KEY,
    chapter_number INT UNIQUE NOT NULL,
    story_title TEXT NOT NULL
);
