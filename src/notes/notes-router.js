const express = require('express');
const path = require('path');
const NotesService = require('./notes-service');
const ExercisesService = require('../exercises/exercises-service');
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
        const { 
            hint_id, 
            custom_note,
        } = req.body;
        
        const newNote = { hint_id };

        for (const [key, value] of Object.entries(newNote)) {
            if (value == null) {
                return res.status(400).json({
                    error: `Missing '${key}' in request body`,
                });
            }
        }

        newNote.custom_note = custom_note;
        newNote.user_id = req.user.id;

        ExercisesService.getHintById(
            req.app.get('db'),
            hint_id
        )
            .then(hint => {
                if (!hint) {
                    return res.status(404).json({ error: `Hint with id equal to 'hint_id' not found` });
                } else {
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
                }
            })
            .catch(next);
    });

notesRouter
    .route('/:note_id')
    .all(requireAuth, (req, res, next) => {
        NotesService.getById(
            req.app.get('db'),
            req.params.note_id
        )
            .then(note => {
                if (!note) {
                    return res.status(404).json({
                        error: { message: `Note doesn't exist` }
                    });
                } else if (note.user_id !== req.user.id) {
                    // Prevent users from accessing notes that do not belong to them
                    return res.status(401).json({ error: `Unauthorized request` });
                }

                res.note = note;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.json(NotesService.serializeNote(res.note));
    })
    .delete((req, res, next) => {
        NotesService.deleteNote(
            req.app.get('db'),
            req.params.note_id
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const { 
            hint_id, 
            custom_note, 
            date_modified, 
        } = req.body;
        
        const noteToUpdate = { 
            hint_id, 
            custom_note, 
            date_modified,
        };

        const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain one of 'hint_id', 'custom_note', or 'date_modified'`,
                },
            });
        }

        if (hint_id) {
            ExercisesService.getHintById(
                req.app.get('db'),
                hint_id
            )
                .then(hint => {
                    if (!hint) {
                        return res.status(404).json({ error: `Hint with id equal to 'hint_id' not found` });
                    } else {
                        NotesService.updateNote(
                            req.app.get('db'),
                            req.params.note_id,
                            noteToUpdate
                        )
                            .then(numRowsAffected => {
                                res.status(204).end();
                            })
                            .catch(next);
                    }
                })
        } else {
            NotesService.updateNote(
                req.app.get('db'),
                req.params.note_id,
                noteToUpdate
            )
                .then(numRowsAffected => {
                    res.status(204).end();
                })
                .catch(next);
        }
    });

module.exports = notesRouter;
