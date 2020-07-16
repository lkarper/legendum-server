const ProgressService = {
    getById(db, id) {
        return db
            .from('legendum_completed_exercises AS lce')
            .select('*')
            .join('legendum_exercises AS le','lce.exercise_id', 'le.id')
            .where('lce.id', id)
            .first();
    },
    getByUserId(db, id) {
        return db
            .from('legendum_completed_exercises AS lce')
            .select(
                'lce.id',
                'lce.exercise_id',
                'lce.date_completed',
                'le.exercise_title',
                'le.exercise_translation',
            )
            .join('legendum_exercises AS le','lce.exercise_id', 'le.id')
            .where('lce.user_id', id);
    },
    insertProgress(db, newProgress) {
        return db
            .insert(newProgress)
            .into('legendum_completed_exercises')
            .returning('*')
            .then(([progress]) => progress)
            .then(progress => 
                ProgressService.getById(db, progress.id)    
            );
    }
}

module.exports = ProgressService;