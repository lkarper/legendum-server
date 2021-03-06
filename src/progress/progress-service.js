const ProgressService = {
    getById(db, id) {
        return db
            .from('legendum_completed_exercises AS lce')
            .select(
                'lce.id',
                'lce.chapter_number',
                'lce.date_completed',
                'le.exercise_title',
                'le.exercise_translation',
                'lce.user_id'
            )
            .join('legendum_exercises AS le','lce.chapter_number', 'le.chapter_number')
            .where('lce.id', id)
            .first();
    },
    getByUserId(db, id) {
        return db
            .from('legendum_completed_exercises AS lce')
            .select(
                'lce.id',
                'lce.chapter_number',
                'lce.date_completed',
                'le.exercise_title',
                'le.exercise_translation',
            )
            .join('legendum_exercises AS le','lce.chapter_number', 'le.chapter_number')
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
    },
    removeProgress(db, id) {
        return db('legendum_completed_exercises')
            .where({ id })
            .delete();
    },
}

module.exports = ProgressService;
