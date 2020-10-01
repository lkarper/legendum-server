const xss = require('xss');

const ExercisesService = {
    getAllExercises(db) {
        return db 
            .select('*')
            .from('legendum_exercises AS le')
            .orderBy('le.id');
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
    getExercisesLearnById(db, id) {
        return db
            .select(
                'lel.id', 
                'lel.exercise_id', 
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
            .where('lel.exercise_id', id)
            .join('legendum_exercises AS le', 'lel.exercise_id', 'le.id')
            .orderBy('lel.page');
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
};

module.exports = ExercisesService;