const xss = require('xss');

const ExercisesService = {
    getAllExercises(db) {
        return db 
            .select('*')
            .from('legendum_exercises AS le')
            .orderBy('le.chapter_number');
    },
    checkChapterNumberAlreadyInUse(db, chapter_number) {
        return db('legendum_exercises')
            .where({ chapter_number })
            .first()
            .then(chapter_number => !!chapter_number);
    },
    insertNewExercise(db, newExercise) {
        return db('legendum_exercises')
            .insert(newExercise)
            .returning('*')
            .then(([exercise]) => exercise);
    },
    getExerciseById(db, id) {
        return db('legendum_exercises')
            .select('*')
            .where({ id })
            .first();
    },
    deleteExercise(db, id) {
        return db('legendum_exercises')
            .where({ id })
            .delete();
    },
    updateExercise(db, id, exerciseUpdates) {
        return db('legendum_exercises')
            .where({ id })
            .update(exerciseUpdates);
    },
    getExercisesLearnByChapter(db, chapter_number) {
        return db
            .select(
                'lel.id', 
                'lel.chapter_number', 
                'lel.page', 
                'lel.text', 
                'lel.image_url',
                'lel.image_alt_text',
                'lel.background_image_url',
                'lel.background_image_alt_text', 
                'le.exercise_title', 
                'le.exercise_translation',
                db.raw(
                    `(
                        select array_to_json(
                            array_agg(row_to_json(h))
                        ) from (
                            select id, hint_order_number, hint 
                            from legendum_exercises_learn_hints AS lelh
                            where lelh.exercise_page_id=lel.id
                        ) h
                    ) as hints`
                )
            )
            .from('legendum_exercises_learn AS lel')
            .where('lel.chapter_number', chapter_number)
            .join('legendum_exercises AS le', 'lel.chapter_number', 'le.chapter_number')
            .orderBy('lel.page');
    },
    insertExercisesLearnPage(db, newPage) {
        return db('legendum_exercises_learn')
            .insert(newPage)
            .returning('*')
            .then(([newPage]) => {
                return this.getExercisesLearnByChapter(
                    db, newPage.chapter_number
                )
                    .where('lel.id', newPage.id)
                    .first();
            });
    },
    getExercisesLearnPageById(db, chapter_number, id) {
        return this.getExercisesLearnByChapter(
            db,
            chapter_number
        )
            .where('lel.id', id)
            .first();
    },
    removeExercisesLearnPage(db, id) {
        return db('legendum_exercises_learn')
            .where({ id })
            .delete();
    },
    updateExercisesLearnPage(db, id, pageUpdates) {
        return db('legendum_exercises_learn')
            .where({ id })
            .update(pageUpdates);
    },
    getHintsByLearnPageId(db, exercise_page_id) {
        return db('legendum_exercises_learn_hints')
            .select('*')
            .where({ exercise_page_id })
            .orderBy('hint_order_number');
    },
    insertHint(db, newHint) {
        return db('legendum_exercises_learn_hints')
            .insert(newHint)
            .returning('*')
            .then(([hint]) => hint);
    },
    getHintById(db, id) {
        return db('legendum_exercises_learn_hints')
            .select('*')
            .where({ id })
            .first();
    },
    removeHint(db, id) {
        return db('legendum_exercises_learn_hints')
            .where({ id })
            .delete();
    },
    updateHint(db, id, hintUpdates) {
        return db('legendum_exercises_learn_hints')
            .where({ id })
            .update(hintUpdates);
    },
    getExercisesDoByChapter(db, chapter_number) {
        return db
            .select('*')
            .from('legendum_exercises_do AS led')
            .where('led.chapter_number', chapter_number)
            .join('legendum_exercises AS le', 'le.chapter_number', 'led.chapter_number')
            .orderBy('led.page');
    }, 
    insertExerciseDoPage(db, newDoPage) {
        return db('legendum_exercises_do')
            .insert(newDoPage)
            .returning('*')
            .then(([doPage]) => doPage)
            .then(doPage => 
                this.getExercisesDoByChapter(db, doPage.chapter_number)
                    .where('led.id', doPage.id)
                    .first()
            );
    },
    getExercisesDoPageById(db, chapter_number, id) {
        return this.getExercisesDoByChapter(db, chapter_number)
            .where('led.id', id)
            .first();
    },
    removeExercisesDoPage(db, id) {
        return db('legendum_exercises_do')
            .where({ id })
            .delete();
    },
    updateExercisesDoPage(db, id, fieldsToUpdate) {
        return db('legendum_exercises_do')
            .where({ id })
            .update(fieldsToUpdate);
    },
    serializeExercise(exercise) {
        return {
            id: exercise.id,
            chapter_number: exercise.chapter_number,
            exercise_title: xss(exercise.exercise_title),
            exercise_translation: xss(exercise.exercise_translation),
        };
    },
    serializeLearnPage(page) {
        const hints = page.hints || [];
        return {
            id: page.id,
            chapter_number: page.chapter_number,
            page: page.page,
            text: xss(page.text),
            image_url: xss(page.image_url),
            image_alt_text: xss(page.image_alt_text),
            background_image_url: xss(page.background_image_url),
            background_image_alt_text: xss(page.background_image_alt_text),
            exercise_title: xss(page.exercise_title),
            exercise_translation: xss(page.exercise_translation),
            hints: hints.map(hint => ({
                id: hint.id,
                hint_order_number: hint.hint_order_number,
                hint: xss(hint.hint),
            })),
        };
    },
    serializeHint(hint) {
        return {
            id: hint.id,
            exercise_page_id: hint.exercise_page_id,
            hint_order_number: hint.hint_order_number,
            hint: xss(hint.hint),
        };
    },
    serializeDoPage(page) {
        return {
            id: page.id,
            chapter_number: page.chapter_number,
            page: page.page,
            dialogue: xss(page.dialogue),
            dialogue_look_back: page.dialogue_look_back,
            dialogue_to_look_for: xss(page.dialogue_to_look_for || ''),
            question_type: page.question_type,
            question: xss(page.question),
            incorrect_response_option_1: xss(page.incorrect_response_option_1),
            incorrect_response_option_2: xss(page.incorrect_response_option_2),
            incorrect_response_option_3: xss(page.incorrect_response_option_3),
            correct_response: xss(page.correct_response),
            response_if_incorrect_1: xss(page.response_if_incorrect_1),
            response_if_incorrect_2: xss(page.response_if_incorrect_2),
            response_if_incorrect_3: xss(page.response_if_incorrect_3),
            look_ahead: page.look_ahead,
            look_back: page.look_back,
            property_to_save: xss(page.property_to_save || ''),
            property_to_look_for: xss(page.property_to_look_for || ''),
            image_url: xss(page.image_url),
            image_alt_text: xss(page.image_alt_text),
            input_label: xss(page.input_label || ''),
            background_image_url: xss(page.background_image_url),
            background_image_alt_text: xss(page.background_image_alt_text),
            exercise_title: xss(page.exercise_title),
            exercise_translation: xss(page.exercise_translation),
        };
    }
};

module.exports = ExercisesService;
