const ExercisesService = {
    getExercisesLearnById(db, id) {
        return db
            .select('lel.id', 'lel.exercise_id', 'lel.page', 'lel.text', 'lel.image_url','lel.image_alt_text', 'le.exercise_title', 'le.exercise_translation', 'lelh.hints')
            .from('legendum_exercises_learn AS lel')
            .where('lel.exercise_id', id)
            .join('legendum_exercises AS le', 'lel.exercise_id', 'le.id')
            .leftJoin('legendum_exercises_learn_hints AS lelh', 'lel.id', 'lelh.exercise_page_id')
            .orderBy('lel.page');
    }
};

module.exports = ExercisesService;