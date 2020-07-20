const ExercisesService = {
    getExercisesLearnById(db, id) {
        return db
            .select(
                'lel.id', 
                'lel.exercise_id', 
                'lel.page', 
                'lel.text', 
                'lel.image_url',
                'lel.image_alt_text', 
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
    getAllExercises(db) {
        return db 
            .select('*')
            .from('legendum_exercises AS le')
            .orderBy('le.id');
    }
};

module.exports = ExercisesService;