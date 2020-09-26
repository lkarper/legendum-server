const express = require('express');
const path = require('path');
const { requireAuth } = require('../middleware/jwt-auth');
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
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { 
            story_title,
            chapter_number,
        } = req.body;

        // Only admins may create new story content
        if (!req.user.admin) {
            return res.status(401).json({
                error: 'This account does not have admin privileges',
            });
        }

        for (element of [story_title, chapter_number]) {
            if (!element) {
                return res.status(400).json({
                    error: `Missing '${element}' in request body`
                });
            }
        }

        const story = { 
            story_title,
            chapter_number,
        };

        StoriesService.insertStory(
            req.app.get('db'),
            story
        )
            .then(story => {
                return res.status(201)
                    .location(path.posix.join(req.originalUrl, `/${story.id}`))
                    .json(StoriesService.serializeStory(story));
            })
            .catch(next);
    });

storiesRouter
    .route('/:story_id')
    .get(checkStoryExists, (req, res, next) => {
        return res.json(
            StoriesService.serializeStory(res.story)
        );
    })
    .delete(requireAuth, (req, res, next) => {
        // Only admins may delete stories
        if (!req.user.admin) {
            return res.status(401).json({
                error: 'This account does not have admin privileges',
            });
        }

        StoriesService.deleteStory(
            req.app.get('db'),
            req.params.story_id
        )
            .then(() => res.status(204).end())
            .catch(next);
    })
    .patch(requireAuth, (req, res, next) => {
        // Only admins may update story content
        if (!req.user.admin) {
            return res.status(401).json({
                error: 'This account does not have admin privileges',
            });
        }

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

        StoriesService.updateStory(
            req.app.get('db'),
            req.params.story_id,
            storyToUpdate
        )
            .then(numRowsAffected => res.status(204).end())
            .catch(next);
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
