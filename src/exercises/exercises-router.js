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

        ExercisesService.checkChapterNumberAlreadyInUse(
            req.app.get('db'),
            chapter_number
        )
        .then(chapterNumberInUse => {
            if (chapterNumberInUse) {
                return res.status(400).json({
                    error: `Chapter number is already in use`,
                });
            } else  {
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

        if (chapter_number && chapter_number !== res.exercise.chapter_number) {
            ExercisesService.checkChapterNumberAlreadyInUse(
                req.app.get('db'),
                chapter_number
            )
                .then(chapterNumberInUse => {
                    if (chapterNumberInUse) {
                        return res.status(400).json({
                            error: `Chapter number is already in use`,
                        });
                    } else {
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
    .route('/:chapter_number/learn-pages')
    .all(checkChapterExists)
    .get((req, res, next) => {
        ExercisesService.getExercisesLearnByChapter(
            req.app.get('db'),
            req.params.chapter_number
        )
            .then(pages => {
                res.json(pages.map(ExercisesService.serializeLearnPage));
            })
            .catch(next);
    })
    .post(requireAuth, (req, res, next) => {
        // Only admins may add exercise learn-pages
        if (!req.user.admin) {
            return res.status(401).json({
                error: 'This account does not have admin privileges',
            }); 
        }

        const {
            page,
            text,
            image_url,
            image_alt_text,
            background_image_url,
            background_image_alt_text,
        } = req.body;

        const newPage = {
            page,
            text,
        };

        for (const [key, value] of Object.entries(newPage)) {
            if (value == null) {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`,
                    },
                });
            }
        }

        newPage.image_url = image_url;
        newPage.image_alt_text = image_alt_text;
        newPage.background_image_url = background_image_url;
        newPage.background_image_alt_text = background_image_alt_text;
        newPage.chapter_number = req.params.chapter_number;

        ExercisesService.insertExercisesLearnPage(
            req.app.get('db'),
            newPage
        )
            .then(newPage => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${newPage.id}`))
                    .json(ExercisesService.serializeLearnPage(newPage));
            })
            .catch(next);

    });

exercisesRouter
    .route('/:chapter_number/learn-pages/:page_id')
    .all(checkChapterExists)
    .all(checkLearnPageExists)
    .get((req, res, next) => {
        return res.json(ExercisesService.serializeLearnPage(res.learnPage));
    })
    .delete(requireAuth, (req, res, next) => {
        // Only admins may delete exercise learn-pages
        if (!req.user.admin) {
            return res.status(401).json({
                error: 'This account does not have admin privileges',
            }); 
        }

        ExercisesService.removeExercisesLearnPage(
            req.app.get('db'),
            req.params.page_id
        )
            .then(() => {
                return res.status(204).end();
            })
            .catch(next);
    })
    .patch(requireAuth, (req, res, next) => {
        // Only admins may update exercise learn-pages
        if (!req.user.admin) {
            return res.status(401).json({
                error: 'This account does not have admin privileges',
            }); 
        }

        const {
            page,
            text,
            image_url,
            image_alt_text,
            background_image_url,
            background_image_alt_text,
        } = req.body;

        const learnPageUpdates = {
            page,
            text,
            image_url,
            image_alt_text,
            background_image_url,
            background_image_alt_text,
        };
        
        const numberOfValues = Object.values(learnPageUpdates).filter(Boolean).length; 
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: `Request body must contain one of 'page', 'text', 'image_url', 'image_alt_text', 'background_image_url', 'background_image_alt_text'.`,
            });
        }

        ExercisesService.updateExercisesLearnPage(
            req.app.get('db'),
            req.params.page_id,
            learnPageUpdates
        )
            .then(numRowsAffected => {
                res.status(204).end();
            })
            .catch(next);
    });

exercisesRouter
    .route('/:chapter_number/learn-pages/:page_id/hints')
    .all(checkChapterExists)
    .all(checkLearnPageExists)
    .get((req, res, next) => {
        ExercisesService.getHintsByLearnPageId(
            req.app.get('db'),
            req.params.page_id
        )
            .then(hints => {
                res.json(hints.map(ExercisesService.serializeHint));
            })
            .catch(next);
    })
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        // Only admins may post hints
        if (!req.user.admin) {
            return res.status(401).json({
                error: 'This account does not have admin privileges',
            }); 
        }

        const {
            hint_order_number,
            hint,
        } = req.body;

        const newHint = {
            hint_order_number,
            hint,
        };

        for (const [key, value] of Object.entries(newHint)) {
            if (value == null) {
                return res.status(400).json({
                    error: `Missing '${key}' in request body`,
                });
            }
        }

        newHint.exercise_page_id = req.params.page_id;

        ExercisesService.insertHint(
            req.app.get('db'),
            newHint
        )
            .then(hint => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${hint.id}`))
                    .json(ExercisesService.serializeHint(hint));
            })
            .catch(next);
    });

exercisesRouter
    .route('/:chapter_number/learn-pages/:page_id/hints/:hint_id')
    .all(checkChapterExists)
    .all(checkLearnPageExists)
    .all(checkHintExists)
    .get((req, res, next) => {
        return res.json(ExercisesService.serializeHint(res.hint));
    })
    .delete(requireAuth, (req, res, next) => {
        // Only admins may delete hints
        if (!req.user.admin) {
            return res.status(401).json({
                error: 'This account does not have admin privileges',
            }); 
        }

        ExercisesService.removeHint(
            req.app.get('db'),
            req.params.hint_id
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })
    .patch(requireAuth, jsonBodyParser, (req, res, next) => {
        // Only admins may delete hints
        if (!req.user.admin) {
            return res.status(401).json({
                error: 'This account does not have admin privileges',
            }); 
        }
        
        const {
            hint_order_number,
            hint,
        } = req.body;

        const hintUpdates = {
            hint_order_number,
            hint,
        };

        const numberOfValues = Object.values(hintUpdates).filter(Boolean).length;
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: `Request body must contain one of 'hint_order_number' or 'hint'.`,
            });
        }

        ExercisesService.updateHint(
            req.app.get('db'),
            req.params.hint_id,
            hintUpdates
        )
            .then(numRowsAffected => {
                res.status(204).end();
            })
            .catch(next);
    });

// Pick up here
exercisesRouter
    .route('/:chapter_number/do-pages')
    .get((req, res, next) => {
        ExercisesService.getExercisesDoById(
            req.app.get('db'),
            req.params.chapter_number
        )
            .then(pages => {
                res.json(pages);
            })
            .catch(next);
    });

async function checkHintExists(req, res, next) {
    try {
        const hint = await ExercisesService.getHintById(
            req.app.get('db'),
            req.params.hint_id
        );

        if (!hint) {
            return res.status(404).json({
                error: `Hint not found`,
            });
        }

        res.hint = hint;
        next();
    } catch(error) {
        next(error);
    }
}

async function checkLearnPageExists(req, res, next) {
    try {
        const learnPage = await ExercisesService.getExercisesLearnPageById(
            req.app.get('db'),
            req.params.chapter_number,
            req.params.page_id
        );

        if (!learnPage) {
            return res.status(404).json({
                error: `Exercise learn page not found`,
            });
        }

        res.learnPage = learnPage;
        next();
    } catch(error) {
        next(error);
    }
}

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
