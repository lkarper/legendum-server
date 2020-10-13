const path = require('path');
const express = require('express');
const { requireAuth, verifyAdminPrivileges } = require('../middleware/jwt-auth');
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
    .post(requireAuth, verifyAdminPrivileges, jsonBodyParser, (req, res, next) => {
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
                // Each chapter may only have one exercise
                return res.status(400).json({
                    error: `Chapter number is already in use`,
                });
            } else  {
                StoriesService.hasStoryWithChapterNumber(
                    req.app.get('db'),
                    chapter_number
                )
                    .then(chapterNumberExists => {
                        // Verifies whether chapter number in which exercise is to be placed exists
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
    .delete(requireAuth, verifyAdminPrivileges, (req, res, next) => {
        ExercisesService.deleteExercise(
            req.app.get('db'),
            req.params.exercise_id
        )
            .then(() => res.status(204).end())
            .catch(next);
    })
    .patch(requireAuth, verifyAdminPrivileges, jsonBodyParser, (req, res, next) => {
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
                        // Each chapter may only have one exercise
                        return res.status(400).json({
                            error: `Chapter number is already in use`,
                        });
                    } else {
                        StoriesService.hasStoryWithChapterNumber(
                            req.app.get('db'),
                            chapter_number
                        )
                            .then(chapterNumberExists => {
                                // Verifies whether chapter number in which exercise is to be placed exists
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
                .then(numRowsAffected => res.status(204).end())
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
    .post(requireAuth, verifyAdminPrivileges, jsonBodyParser, (req, res, next) => {
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
                    error: `Missing '${key}' in request body`,
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
        res.json(ExercisesService.serializeLearnPage(res.learnPage));
    })
    .delete(requireAuth, verifyAdminPrivileges, (req, res, next) => {
        ExercisesService.removeExercisesLearnPage(
            req.app.get('db'),
            req.params.page_id
        )
            .then(() => res.status(204).end())
            .catch(next);
    })
    .patch(requireAuth, verifyAdminPrivileges, jsonBodyParser, (req, res, next) => {
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
            .then(numRowsAffected => res.status(204).end())
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
    .post(requireAuth, verifyAdminPrivileges, jsonBodyParser, (req, res, next) => {
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
    .delete(requireAuth, verifyAdminPrivileges, (req, res, next) => {
        ExercisesService.removeHint(
            req.app.get('db'),
            req.params.hint_id
        )
            .then(() => res.status(204).end())
            .catch(next);
    })
    .patch(requireAuth, verifyAdminPrivileges, jsonBodyParser, (req, res, next) => {
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
            .then(numRowsAffected => res.status(204).end())
            .catch(next);
    });

exercisesRouter
    .route('/:chapter_number/do-pages')
    .all(checkChapterExists)
    .get((req, res, next) => {
        ExercisesService.getExercisesDoByChapter(
            req.app.get('db'),
            req.params.chapter_number
        )
            .then(pages => {
                res.json(pages.map(ExercisesService.serializeDoPage));
            })
            .catch(next);
    })
    .post(requireAuth, verifyAdminPrivileges, jsonBodyParser, (req, res, next) => {
        const {
            page,
            dialogue,
            dialogue_look_back,
            dialogue_to_look_for,
            question_type,
            question,
            incorrect_response_option_1,
            incorrect_response_option_2,
            incorrect_response_option_3,
            correct_response,
            response_if_incorrect_1,
            response_if_incorrect_2,
            response_if_incorrect_3,
            look_ahead,
            look_back,
            property_to_save,
            property_to_look_for, 
            image_url,
            image_alt_text,
            input_label,
            background_image_url,
            background_image_alt_text,
        } = req.body;

        const newDoPage = {
            page,
            question_type,
            question,
        };

        for (const [key, value] of Object.entries(newDoPage)) {
            if (value == null) {
                return res.status(400).json({
                    error: `Missing '${key}' in request body`,
                });
            }
        }

        newDoPage.chapter_number = req.params.chapter_number;
        newDoPage.dialogue = dialogue;
        newDoPage.dialogue_look_back = dialogue_look_back;
        newDoPage.dialogue_to_look_for = dialogue_to_look_for;
        newDoPage.incorrect_response_option_1 = incorrect_response_option_1;
        newDoPage.incorrect_response_option_2 = incorrect_response_option_2;
        newDoPage.incorrect_response_option_3 = incorrect_response_option_3;
        newDoPage.correct_response = correct_response;
        newDoPage.response_if_incorrect_1 = response_if_incorrect_1;
        newDoPage.response_if_incorrect_2 = response_if_incorrect_2;
        newDoPage.response_if_incorrect_3 = response_if_incorrect_3;
        newDoPage.look_ahead = look_ahead;
        newDoPage.look_back = look_back;
        newDoPage.property_to_save = property_to_save;
        newDoPage.property_to_look_for = property_to_look_for;
        newDoPage.image_url = image_url;
        newDoPage.image_alt_text = image_alt_text;
        newDoPage.input_label = input_label;
        newDoPage.background_image_url = background_image_url;
        newDoPage.background_image_alt_text = background_image_alt_text;

        ExercisesService.insertExerciseDoPage(
            req.app.get('db'),
            newDoPage
        )
            .then(doPage => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${doPage.id}`))
                    .json(ExercisesService.serializeDoPage(doPage));
            })
            .catch(next);
    });

exercisesRouter
    .route('/:chapter_number/do-pages/:page_id')
    .all(checkChapterExists)
    .all(checkDoPageExists)
    .get((req, res, next) => {
        res.json(ExercisesService.serializeDoPage(res.doPage));
    })
    .delete(requireAuth, verifyAdminPrivileges, (req, res, next) => {
        ExercisesService.deleteExercise(
            req.app.get('db'),
            req.params.page_id
        )
            .then(() => {
                res.status(204).end();
            })
            .catch(next);
    })
    .patch(requireAuth, verifyAdminPrivileges, jsonBodyParser, (req, res, next) => {
        const {
            page,
            dialogue,
            dialogue_look_back,
            dialogue_to_look_for,
            question_type,
            question,
            incorrect_response_option_1,
            incorrect_response_option_2,
            incorrect_response_option_3,
            correct_response,
            response_if_incorrect_1,
            response_if_incorrect_2,
            response_if_incorrect_3,
            look_ahead,
            look_back,
            property_to_save,
            property_to_look_for, 
            image_url,
            image_alt_text,
            input_label,
            background_image_url,
            background_image_alt_text,
        } = req.body;

        const doPageFieldsToUpdate = {
            page,
            dialogue,
            dialogue_look_back,
            dialogue_to_look_for,
            question_type,
            question,
            incorrect_response_option_1,
            incorrect_response_option_2,
            incorrect_response_option_3,
            correct_response,
            response_if_incorrect_1,
            response_if_incorrect_2,
            response_if_incorrect_3,
            look_ahead,
            look_back,
            property_to_save,
            property_to_look_for, 
            image_url,
            image_alt_text,
            input_label,
            background_image_url,
            background_image_alt_text,
        };

        const numberOfValues = Object.values(doPageFieldsToUpdate).filter(Boolean).length;
        if (numberOfValues.length === 0) {
            return res.status(400).json({
                error: `Request body must contain one of: 'page', 'dialogue', 'dialogue_look_back', 'dialogue_to_look_for', 'question_type', 'question', 'incorrect_response_option_1', 'incorrect_response_option_2', 'incorrect_response_option_3', 'correct_response', 'response_if_incorrect_1', 'response_if_incorrect_2', 'response_if_incorrect_3', 'look_ahead', 'look_back', 'property_to_save', 'property_to_look_for', 'image_url', 'image_alt_text', 'input_label', 'background_image_url', 'background_image_alt_text'.`,
            });
        }

        ExercisesService.updateExercisesDoPage(
            req.app.get('db'),
            req.params.page_id,
            doPageFieldsToUpdate
        )
            .then(numRowsAffected => res.status(204).end())
            .catch(next);
    });
    
async function checkDoPageExists(req, res, next) {
    try {
        const doPage = await ExercisesService.getExercisesDoPageById(
            req.app.get('db'),
            req.params.chapter_number,
            req.params.page_id
        );

        if (!doPage) {
            return res.status(404).json({
                error: `Exercise do page not found`,
            });
        }

        res.doPage = doPage;
        next();
    } catch(error) {
        next(error);
    }
}

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
