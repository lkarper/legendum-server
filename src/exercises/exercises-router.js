const path = require('path');
const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const StoriesService = require('../stories/stories-service');
const ExercisesService = require('./exercises-service');

const exercisesRouter = express.Router();
const jsonBodyParser = express.json();

exercisesRouter
    .route('/')
    .get((req, res, next) => {
        ExercisesService.getAllExercises(req.app.get('db'))
            .then(exercises => {
                res.json(exercises);
            })
            .catch(next);
    })
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        // Only admins may create new exxercises
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
                                .json(exercise);
                        })
                }
            });
    });

exercisesRouter
    .route('/:exercises_id/learn')
    .get((req, res, next) => {
        ExercisesService.getExercisesLearnById(
            req.app.get('db'),
            req.params.exercises_id
        )
            .then(pages => {
                res.json(pages);
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



module.exports = exercisesRouter;
