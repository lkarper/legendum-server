const path = require('path');
const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const { checkChapterExists } = require('../middleware/chapt-mw');
const StoriesService = require('../stories/stories-service');
const ExercisesService = require('./exercises-service');

const exercisesRouter = express.Router();
const jsonBodyParser = express.json();

exercisesRouter
    .route('/')
    .get((req, res, next) => {
        ExercisesService.getAllExercises(req.app.get('db'))
            .then(exercises => {
                res.json(exercises.map(ExercisesService.serializeExercise));
            })
            .catch(next);
    })
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        // Only admins may create new exercises
        if (!req.user.admin) {
            return res.status(401).json({
                error: 'This account does not have admin privileges',
            });
        }

        const { 
            chapter_number,
            exercise_title,
            exercise_translation,
        } = req.body;

        const newExercise = { 
            chapter_number,
            exercise_title,
            exercise_translation,
        };

        for (const [key, value] of Object.entries(newExercise)) {
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
                    ExercisesService.insertNewExercise(
                        req.app.get('db'),
                        newExercise
                    )
                        .then(exercise => {
                            res
                                .status(201)
                                .location(path.posix.join(req.originalUrl, `/${exercise.id}`))
                                .json(ExercisesService.serializeExercise(exercise));
                        })
                        .catch(next);
                }
            })
            .catch(next);
    });

exercisesRouter
    .route('/:exercise_id')
    .all(checkExerciseExists)
    .get((req, res, next) => {
        res.json(ExercisesService.serializeExercise(res.exercise));
    })
    .delete(requireAuth, (req, res, next) => {
        // Only admins may delete exercises
        if (!req.user.admin) {
            return res.status(401).json({
                error: 'This account does not have admin privileges',
            }); 
        }

        ExercisesService.deleteExercise(
            req.app.get('db'),
            req.params.exercise_id
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })
    .patch(requireAuth, jsonBodyParser, (req, res, next) => {
        // Only admins may delete exercises
        if (!req.user.admin) {
            return res.status(401).json({
                error: 'This account does not have admin privileges',
            }); 
        }
        const { 
            chapter_number,
            exercise_title,
            exercise_translation,
        } = req.body;

        const exerciseToUpdate = { 
            chapter_number,
            exercise_title,
            exercise_translation,
        };

        const numberOfValues = Object.values(exerciseToUpdate).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain one of 'chapter_number', 'exercise_title', 'exercise_translation'.`,
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
                        ExercisesService.updateExercise(
                            req.app.get('db'),
                            req.params.exercise_id,
                            exerciseToUpdate
                        )
                            .then(numRowsAffected => {
                                res.status(204).end();
                            })
                            .catch(next);
                    }
                })
                .catch(next);
        } else {
            ExercisesService.updateExercise(
                req.app.get('db'),
                req.params.exercise_id,
                exerciseToUpdate
            )
                .then(numRowsAffected => {
                    res.status(204).end();
                })
                .catch(next);
        }
    });

exercisesRouter
    .route('/:chapter_number/learn')
    .all(checkChapterExists)
    .get((req, res, next) => {
        ExercisesService.getExercisesLearnByChapter(
            req.app.get('db'),
            req.params.chapter_number
        )
            .then(pages => {
                res.json(pages.map(ExercisesService.serializePage));
            })
            .catch(next);
    });

exercisesRouter
    .route('/:exercises_id/do')
    .get((req, res, next) => {
        ExercisesService.getExercisesDoById(
            req.app.get('db'),
            req.params.exercises_id
        )
            .then(pages => {
                res.json(pages);
            })
            .catch(next);
    });

async function checkExerciseExists(req, res, next) {
    try {
        const exercise = await ExercisesService.getExerciseById(
            req.app.get('db'),
            req.params.exercise_id
        );

        if (!exercise) {
            return res.status(404).json({
                error: {
                    message: `Exercise doesn't exist`,
                },
            });
        }

        res.exercise = exercise;
        next();
    } catch(error) {
        next(error);
    }
}

module.exports = exercisesRouter;
