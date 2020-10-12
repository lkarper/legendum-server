const express = require('express');
const path = require('path');
const ProgressService = require('./progress-service');
const ExercisesService = require('../exercises/exercises-service');
const { requireAuth } = require('../middleware/jwt-auth');

const progressRouter = express.Router();
const jsonBodyParser = express.json();

progressRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        ProgressService.getByUserId(
            req.app.get('db'),
            req.user.id
        )
            .then(progress => res.json(progress))
            .catch(next);
    })
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { chapter_number } = req.body;

        if (!chapter_number) {
            return res.status(400).json({
                error: `Missing 'chapter_number' in request body`,
            });
        }
        
        const completedExercise = {
            chapter_number,
            user_id: req.user.id,
        };

        ExercisesService.checkChapterNumberAlreadyInUse(
            req.app.get('db'),
            chapter_number
        )
            .then(chapterNumberExists => {
                if (!chapterNumberExists) {
                    return res.status(404).json({
                        error: `Exercise not found`,
                    });
                } else {
                    ProgressService.insertProgress(
                        req.app.get('db'),
                        completedExercise
                    )
                        .then(progress => {
                            res
                                .status(201)
                                .location(path.posix.join(req.originalUrl, `/${progress.id}`))
                                .json(progress);
                        })
                        .catch(next);
                }
            })
            .catch(next);
    })

progressRouter
    .route('/:progress_id')
    .all(requireAuth)
    .all((req, res, next) => {
        ProgressService.getById(
            req.app.get('db'),
            req.params.progress_id
        )
            .then(progress => {
                if (!progress) {
                    return res.status(404).json({
                        error: 'Progress record not found',
                    });
                } else if (progress.user_id !== req.user.id) {
                    return res.status(401).json({ error: `Unauthorized request` });
                }

                res.progress = progress;
                next();
            })
            .catch(next);
    })
    .get((req, res, next) => {
        res.json(res.progress);
    })
    .delete((req, res, next) => {
        ProgressService.removeProgress(
            req.app.get('db'),
            req.params.id
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    });

module.exports = progressRouter;
