const express = require('express');
const path = require('path');
const { requireAuth, verifyAdminPrivileges } = require('../middleware/jwt-auth');
const { checkChapterExists } = require('../middleware/chapt-mw');
const StoriesService = require('./stories-service');

const storiesRouter = express.Router();
const jsonBodyParser = express.json();

storiesRouter
    .route('/')
    .get((req, res, next) => {
        StoriesService.getAllStories(req.app.get('db'))
            .then(stories => res.json(stories.map(StoriesService.serializeStory)))
            .catch(next);
    })
    .post(requireAuth, verifyAdminPrivileges, jsonBodyParser, (req, res, next) => {
        const { 
            story_title,
            chapter_number,
        } = req.body;

        const story = { 
            story_title,
            chapter_number,
        };

        for (const [key, value] of Object.entries(story)) {
            if (value == null) {
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                });
            }
        }

        // chapter_number must be unique, so first check if a chapter_number is already in use
        StoriesService.hasStoryWithChapterNumber(
            req.app.get('db'),
            chapter_number
        )
            .then(chapterNumberExists => {
                if (chapterNumberExists) {
                    return res.status(400).json({ error: `Chapter number is already in use` });
                } else {
                    StoriesService.insertStory(
                        req.app.get('db'),
                        story
                    )
                        .then(story => {
                            return res.status(201)
                                .location(path.posix.join(req.originalUrl, `/${story.id}`))
                                .json(StoriesService.serializeStory(story));
                        });
                }
            })
            .catch(next);
    });

storiesRouter
    .route('/by-chapter/:chapter_number')
    .all(checkChapterExists)
    .get((req, res, next) => {
        return res.json(
            StoriesService.serializeStory(res.chapter)
        );
    });

storiesRouter
    .route('/:story_id')
    .all(checkStoryExists)
    .get((req, res, next) => {
        return res.json(
            StoriesService.serializeStory(res.story)
        );
    })
    .delete(requireAuth, verifyAdminPrivileges, (req, res, next) => {
        StoriesService.deleteStory(
            req.app.get('db'),
            req.params.story_id
        )
            .then(() => res.status(204).end())
            .catch(next);
    })
    .patch(requireAuth, verifyAdminPrivileges, jsonBodyParser, (req, res, next) => {
        const {
            story_title,
            chapter_number,
        } = req.body;

        const storyToUpdate = {
            story_title,
            chapter_number,
        };

        const numberOfValues = Object.values(storyToUpdate).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain one of 'story_title' or 'chapter_number'`,
                },
            });
        }

        if (chapter_number) {
            StoriesService.hasStoryWithChapterNumber(
                req.app.get('db'),
                chapter_number
            )
                .then(chapterNumberExists => {
                    if (chapterNumberExists) {
                        return res.status(400).json({ error: `Chapter number is already in use` });
                    } else {
                        StoriesService.updateStory(
                            req.app.get('db'),
                            req.params.story_id,
                            storyToUpdate
                        )
                            .then(numRowsAffected => res.status(204).end());
                    }
                })
                .catch(next);
        } else {
            StoriesService.updateStory(
                req.app.get('db'),
                req.params.story_id,
                storyToUpdate
            )
                .then(numRowsAffected => res.status(204).end())
                .catch(next);
        }
    });

async function checkStoryExists(req, res, next) {
    try {
        if (!req.params.story_id) {
            return res.status(400).json({
                error: `Request body must contain 'story_id'`,
            })
        }

        const story = await StoriesService.getById(
            req.app.get('db'),
            req.params.story_id
        );

        if (!story) {
            return res.status(404).json({
                error: {
                    message: `Story doesn't exist`,
                },
            });
        }

        res.story = story;
        next();
    } catch (error) {
        next(error);
    }
}    

module.exports = storiesRouter;
