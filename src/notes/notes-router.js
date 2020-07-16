const express = require('express');
const path = require('path');
const NotesService = require('./notes-service');
const { requireAuth } = require('../middleware/jwt-auth');

const notesRouter = express.Router();
const jsonBodyParser = express.json();

notesRouter 
    .route('/')
    .get(requireAuth, (req, res, next) => {
        const user_id = req.user.id;
        NotesService.getByUserId(
            req.app.get('db'),
            user_id
        )
        .then(notes => res.json(notes.map(NotesService.serializeNote)))
        .catch(next);
    })
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { hint_id, custom_note } = req.body;
        const newNote = { hint_id, custom_note };

        for (const [key, value] of Object.entries(newNote)) {
            if (value == null) {
                return res.status(400).json({
                    error: `Missing '${key}' in request body`,
                });
            }
        }

        newNote.user_id = req.user.id;

        NotesService.insertNote(
            req.app.get('db'),
            newNote
        )
            .then(note => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${note.id}`))
                    .json(NotesService.serializeNote(note));
            })
            .catch(next);
    });

module.exports = notesRouter;