CREATE TABLE legendum_dialogue (
    id SERIAL PRIMARY KEY,
    chapter_number INTEGER
        REFERENCES legendum_stories(chapter_number) ON DELETE CASCADE NOT NULL,
    page INTEGER NOT NULL,
    text TEXT NOT NULL,
    image_url TEXT,
    image_alt_text TEXT,
    choices TEXT,
    responses_to_choices TEXT, 
    background_image_url TEXT,
    background_image_alt_text TEXT
);
