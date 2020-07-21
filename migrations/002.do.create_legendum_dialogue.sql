CREATE TABLE legendum_dialogue (
    id SERIAL PRIMARY KEY,
    story_id INTEGER
        REFERENCES legendum_stories(id) ON DELETE CASCADE NOT NULL,
    page INTEGER NOT NULL,
    text TEXT NOT NULL,
    image_url TEXT,
    image_alt_text TEXT,
    choices TEXT,
    responses_to_choices TEXT, 
    background_image_url TEXT,
    background_image_alt_text TEXT
);