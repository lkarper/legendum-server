const DialogueService = {
    getDialogueByStoryId(db, id) {
        return db
            .from('legendum_dialogue AS ld')
            .where('ld.story_id', id)
            .join('legendum_stories AS ls', 'ld.story_id', 'ls.id' );
            
    }, 
}

module.exports = DialogueService;