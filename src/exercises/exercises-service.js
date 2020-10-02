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
    getExercisesDoById(db, id) {
        return db
            .select('*')
            .from('legendum_exercises_do AS led')
            .where('led.exercise_id', id)
            .join('legendum_exercises AS le', 'le.id', 'led.exercise_id')
            .orderBy('led.page');
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
};

module.exports = ExercisesService;