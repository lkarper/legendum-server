const xss = require('xss');

const NotesService = {
    getById(db, id) {
        return db
            .from('legendum_saved_notes AS lsn')
            .select(
                'lsn.id',
                'lsn.hint_id',
                'lsn.custom_note',
                'lsn.date_modified',
                'lelh.hint',
                'le.exercise_title',
                'le.exercise_translation',
                'le.chapter_number AS chapter_number',
            )
            .join('legendum_exercises_learn_hints AS lelh', 'lsn.hint_id', 'lelh.id')
            .join('legendum_exercises_learn AS lel', 'lelh.exercise_page_id', 'lel.id')
            .join('legendum_exercises AS le', 'lel.chapter_number', 'le.chapter_number')
            .where('lsn.id', id)
            .first();
    },
    getByUserId(db, id) {
        return db('legendum_saved_notes AS lsn')
            .select(
                'lsn.id',
                'lsn.hint_id',
                'lsn.custom_note',
                'lsn.date_modified',
                'lelh.hint',
                'le.exercise_title',
                'le.exercise_translation',
                'le.chapter_number AS chapter_number',
            )
            .join('legendum_exercises_learn_hints AS lelh', 'lsn.hint_id', 'lelh.id')
            .join('legendum_exercises_learn AS lel', 'lelh.exercise_page_id', 'lel.id')
            .join('legendum_exercises AS le', 'lel.chapter_number', 'le.chapter_number')
            .where('lsn.user_id', id);
    },
    insertNote(db, newNote) {
        return db
            .insert(newNote)
            .into('legendum_saved_notes')
            .returning('*')
            .then(([note]) => note)
            .then(note =>
                NotesService.getById(db, note.id)
            );   
    },
    updateNote(knex, id, newNoteFields) {
        return knex('legendum_saved_notes')
            .where({ id })
            .update(newNoteFields);
    },
    deleteNote(knex, id) {
        return knex('legendum_saved_notes')
            .where({ id })
            .delete();
    },
    serializeNote(note) {
        return {
            id: note.id,
            hint_id: note.hint_id,
            custom_note: xss(note.custom_note),
            date_modified: new Date(note.date_modified),
            chapter_number: note.chapter_number,
            exercise_title: note.exercise_title,
            exercise_translation: note.exercise_translation,
            hint: note.hint,
        };
    },
}

module.exports = NotesService;