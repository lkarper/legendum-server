const express = require('express');
const DialogueService = require('./dialogue-service');

const dialogueRouter = express.Router();

dialogueRouter
    .route('/:story_id')
    .get((req, res, next) => {
        DialogueService.getDialogueByStoryId(
            req.app.get('db'),
            req.params.story_id
        )
            .then(lines => {
                res.json(lines);
            })
            .catch(next);
    });

module.exports = dialogueRouter;