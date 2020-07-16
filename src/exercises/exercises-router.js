const express = require('express');
const ExercisesService = require('./exercises-service');

const exercisesRouter = express.Router();

exercisesRouter
    .route('/')
    .get((req, res, next) => {
        ExercisesService.getAllExercises(req.app.get('db'))
            .then(exercises => {
                res.json(exercises);
            })
            .catch(next);
    })

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