const express = require('express');
const path = require('path');
const ProgressService = require('./progress-service');
const { requireAuth } = require('../middleware/jwt-auth');

const progressRouter = express.Router();
const jsonBodyParser = express.json();

progressRouter
    .route('/')
    .get(requireAuth, (req, res, next) => {
        const user_id = req.user.id;
        ProgressService.getByUserId(
            req.app.get('db'),
            user_id
        )
            .then(progress => res.json(progress))
            .catch(next);
    })
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        const { exercise_id } = req.body;
        const completedExercise = {
            exercise_id,
            user_id: req.user.id,
        }

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
    })

module.exports = progressRouter;