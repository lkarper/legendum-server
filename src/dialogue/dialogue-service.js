const xss = require('xss');

const DialogueService = {
    getAllDialogue(db) {
        return db
            .from('legendum_dialogue')
            .select('*');
    },
    getDialogueForStory(db, chapterNumber) {
        return db
            .from('legendum_stories AS ls')
            .select(
                'ls.chapter_number',
                'ls.story_title',
                db.raw(
                    `(
                        select array_to_json(
                            array_agg(row_to_json(h))
                        ) from (
                            select
                                id, 
                                page,
                                text,
                                image_url,
                                image_alt_text,
                                choices, 
                                responses_to_choices, 
                                background_image_url, 
                                background_image_alt_text
                            from legendum_dialogue as ld
                            where ld.chapter_number=ls.chapter_number 
                        ) h
                    ) AS "pages"`
                )
            )
            .where('ls.chapter_number', chapterNumber)
            .first();
    },
    insertNewDialogue(db, newDialogue) {
        return db('legendum_dialogue')
            .insert(newDialogue)
            .returning('*')
            .then(([newDialogue]) => newDialogue);
    },
    getDialogueById(db, id) {
        return db('legendum_dialogue AS ld')
            .where('ld.id', id)
            .first();
    },
    removeDialogue(db, id) {
        return db('legendum_dialogue')
            .where({ id })
            .delete();
    },
    updateDialogue(db, id, dialogueToUpdate) {
        return db('legendum_dialogue')
            .where({ id })
            .update(dialogueToUpdate);
    },
    serializeDialogue(dialogue) {
        return {
            id: dialogue.id,
            chapter_number: dialogue.chapter_number,
            page: dialogue.page,
            text: xss(dialogue.text),
            image_url: xss(dialogue.image_url),
            image_alt_text: xss(dialogue.image_alt_text),
            choices: xss(dialogue.choices),
            responses_to_choices: xss(dialogue.responses_to_choices),
            background_image_url: xss(dialogue.background_image_url),
            background_image_alt_text: xss(dialogue.background_image_alt_text),
        };
    },
    serializeDialogueForStory(dialogue) {
        return {
            chapter_number: dialogue.chapter_number,
            story_title: xss(dialogue.story_title),
            pages: dialogue.pages.map(page => ({
                id: page.id,
                page: page.page,
                text: xss(page.text),
                image_url: xss(page.image_url),
                image_alt_text: xss(page.image_alt_text),
                choices: xss(page.choices),
                responses_to_choices: xss(page.responses_to_choices),
                background_image_url: xss(page.background_image_url),
                background_image_alt_text: xss(page.background_image_alt_text),
            })),
        };
    },
};

module.exports = DialogueService;
