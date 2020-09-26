const xss = require('xss');

const StoriesService = {
    getAllStories(db) {
        return db('legendum_stories')
            .select('*');
    },
    insertStory(db, story) {
        return db('legendum_stories')
            .insert(story)
            .returning('*')
            .then(([story]) => story);
    },
    getById(db, id) {
        return db('legendum_stories')
            .where({ id })
            .first();
    },
    deleteStory(db, id) {
        return db('legendum_stories')
            .where({ id })
            .delete();
    },
    updateStory(db, id, newStoryFields) {
        return db('legendum_stories')
            .where({ id })
            .update(newStoryFields);
    },
    serializeStory(story) {
        return {
            id: story.id,
            chapter_number: story.chapter_number,
            story_title: xss(story.story_title),
        };
    },
};

module.exports = StoriesService;
