const path = require('path');
const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const { checkChapterExists } = require('../middleware/chapt-mw');
const StoriesService = require('../stories/stories-service');
const DialogueService = require('./dialogue-service');

const dialogueRouter = express.Router();
const jsonBodyParser = express.json();

dialogueRouter
    .route('/')
    .get((req, res, next) => {
        DialogueService.getAllDialogue(req.app.get('db'))
            .then(dialogue => {
                return res.json(dialogue.map(DialogueService.serializeDialogue));
            })
            .catch(next);
    })
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        // Only admins may create new dialogue content
        if (!req.user.admin) {
            return res.status(401).json({
                error: 'This account does not have admin privileges',
            });
        }

        const {
            chapter_number,
            page,
            text,
            image_url,
            image_alt_text,
            choices,
            responses_to_choices,
            background_image_url,
            background_image_alt_text,
        } = req.body;

        const newDialogue = {
            chapter_number,
            page,
            text,
            image_url,
            image_alt_text,
            choices,
            responses_to_choices,
            background_image_url,
            background_image_alt_text,
        };

        for (const [key, value] of Object.entries(newDialogue)) {
            if (value == null) {
                return res.status(400).json({
                    error: `Missing '${key}' in request body`,
                })
            }
        }

        StoriesService.hasStoryWithChapterNumber(
            req.app.get('db'),
            chapter_number
        )
            .then(chapterNumberExists => {
                if (!chapterNumberExists) {
                    return res.status(404).json({
                        error: `Chapter doesn't exist`,
                    });
                } else {
                    DialogueService.insertNewDialogue(
                        req.app.get('db'),
                        newDialogue
                    )
                        .then(newDialogue => {
                            res.status(201)
                                .location(path.posix.join(req.originalUrl, `/${newDialogue.id}`))
                                .json(DialogueService.serializeDialogue(newDialogue));
                        })
                        .catch(next);
                }
            })
            .catch(next);
    });

dialogueRouter
    .route('/by-chapter/:chapter_number')
    .all(checkChapterExists)
    .get((req, res, next) => {
        DialogueService.getDialogueForStory(
            req.app.get('db'),
            res.chapter.chapter_number
        )
            .then(lines => {
                res.json(DialogueService.serializeDialogueForStory(lines));
            })
            .catch(next);
    });

dialogueRouter
    .route('/:dialogue_id')
    .all(checkDialogueExists)
    .get((req, res, next) => {
        return res.json(DialogueService.serializeDialogue(res.dialogue));
    })
    .delete(requireAuth, (req, res, next) => {
        // Only admins may delete dialogue content
        if (!req.user.admin) {
            return res.status(401).json({
                error: 'This account does not have admin privileges',
            });
        }

        DialogueService.removeDialogue(
            req.app.get('db'),
            res.dialogue.id
        )
            .then(() => res.status(204).end())
            .catch(next);
    })
    .patch(requireAuth, jsonBodyParser, (req, res, next) => {
        // Only admins may update dialogue content
        if (!req.user.admin) {
            return res.status(401).json({
                error: 'This account does not have admin privileges',
            });
        }

        const {
            chapter_number,
            page,
            text,
            image_url,
            image_alt_text,
            choices,
            responses_to_choices,
            background_image_url,
            background_image_alt_text,
        } = req.body;

        const dialogueToUpdate = {
            chapter_number,
            page,
            text,
            image_url,
            image_alt_text,
            choices,
            responses_to_choices,
            background_image_url,
            background_image_alt_text,
        };

        const numberOfValues = Object.values(dialogueToUpdate).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain one of 'chapter_number', 'page', 'text', 'image_url', 'image_alt_text', 'choices', 'responses_to_choices', 'background_image_url', 'background_image_alt_text'.`,
                }
            });
        }

        if (chapter_number) {
            StoriesService.hasStoryWithChapterNumber(
                req.app.get('db'),
                chapter_number
            )
                .then(chapterNumberExists => {
                    if (!chapterNumberExists) {
                        return res.status(404).json({
                            error: `Chapter doesn't exist`,
                        });
                    } else { 
                        DialogueService.updateDialogue(
                            req.app.get('db'),
                            req.params.dialogue_id,
                            dialogueToUpdate
                        )
                            .then(numRowsAffected => {
                                return res.status(204).end();
                            })
                            .catch(next);                
                    }
                })
                .catch(next);
        } else {
            DialogueService.updateDialogue(
                req.app.get('db'),
                req.params.dialogue_id,
                dialogueToUpdate
            )
                .then(numRowsAffected => {
                    return res.status(204).end();
                })
                .catch(next);
        }
    });

async function checkDialogueExists(req, res, next) {
    try {
        const dialogue = await DialogueService.getDialogueById(
            req.app.get('db'),
            req.params.dialogue_id
        );

        if (!dialogue) {
            return res.status(404).json({
                error: {
                    message: `Dialogue doesn't exist`,
                },
            });
        }

        res.dialogue = dialogue;
        next();
    } catch(error) {
        next(error);
    }
}

module.exports = dialogueRouter;
