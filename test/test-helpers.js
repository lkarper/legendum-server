const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

function cleanTables(db) {
    return db.raw(
        `TRUNCATE
            legendum_stories,
            legendum_dialogue,
            legendum_exercises,
            legendum_exercises_learn,
            legendum_exercises_learn_hints,
            legendum_exercises_do,
            legendum_users,
            legendum_saved_notes,
            legendum_completed_exercises RESTART IDENTITY CASCADE;`
    );
}

function makeUsersArray() {
    return [
        {
            id: 1,
            user_name: 'test-user-1',
            password: 'password',
            display_name: 'marcus1',
            admin: true,
        },
        {
            id: 2,
            user_name: 'test-user-2',
            password: 'password',
            display_name: 'marcus2',
        },
        {
            id: 3,
            user_name: 'test-user-3',
            password: 'password',
            display_name: 'marcus3',
        },
        {
            id: 4,
            user_name: 'test-user-4',
            password: 'password',
            display_name: 'marcus4',
        },
        {
            id: 5,
            user_name: 'test-user-5',
            password: 'password',
            display_name: 'marcus5',
        },
    ];
}

function makeUsersFixtures() {
    const testUsers = makeUsersArray();
    
    return {
        testUsers,
    };
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1),
    }));
    return db('legendum_users').insert(preppedUsers);
}

function makeStoriesArray() {
    return [1, 2, 3, 4].map(num => ({
        id: num,
        story_title: `Test Title ${num}`,
        chapter_number: num,
    }));
}

function makeMaliciousStory() {
    return {
        id: 911,
        story_title: 'Naughty naughty very naughty <script>alert("xss");</script>',
        chapter_number: 911,
    };
}

function makeSanatizedStory() {
    return {
        id: 911,
        story_title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        chapter_number: 911,
    };
}

function seedStories(db, stories) {
    return db('legendum_stories')
        .insert(stories);
}

function makeDialogueArray() {
    const stories = makeStoriesArray();

    const dialogue = [1, 2, 3, 4].map(num => ({
        id: num,
        chapter_number: num,
        page: 1,
        text: `Test text for dialogue ${num}`,
        image_url: 'http://placehold.it/500x500',
        image_alt_text: `Test alt ${num}`,
        choices: `“Test choice 1”|“Test choice 2”`,
        responses_to_choices: 'Test response 1|Test Response 2',
        background_image_url: 'http://placehold.it/500x500',
        background_image_alt_text: `Test alt ${num}`,
    }));

    return {
        stories,
        dialogue,
    };
}

function makeMaliciousDialogue() {
    const maliciousStory = makeMaliciousStory();
    const maliciousDialogue = {
        id: 911,
        chapter_number: 911,
        page: 911,
        text: 'Naughty naughty very naughty <script>alert("xss");</script>',
        image_url: 'Naughty naughty very naughty <script>alert("xss");</script>',
        image_alt_text: 'Naughty naughty very naughty <script>alert("xss");</script>',
        choices: 'Naughty naughty very naughty <script>alert("xss");</script>',
        responses_to_choices: 'Naughty naughty very naughty <script>alert("xss");</script>',
        background_image_url: 'Naughty naughty very naughty <script>alert("xss");</script>',
        background_image_alt_text: 'Naughty naughty very naughty <script>alert("xss");</script>',
    };

    return {
        maliciousStory,
        maliciousDialogue,
    };
}

function makeSanatizedDialogue() {
    const sanatizedStory = makeSanatizedStory();
    const sanatizedDialogue = {
        id: 911,
        chapter_number: 911,
        page: 911,
        text: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        image_url: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        image_alt_text: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        choices: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        responses_to_choices: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        background_image_url: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        background_image_alt_text: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    };
    return {
        sanatizedStory,
        sanatizedDialogue,
    };
}

function makeStoryDialogue(story, dialogue) {
    const pages = dialogue || [];
    return {
        chapter_number: story.chapter_number,
        story_title: story.story_title,
        pages: pages.map(page => ({
            id: page.id,
            page: page.page,
            text: page.text,
            image_url: page.image_url,
            image_alt_text: page.image_alt_text,
            choices: page.choices,
            responses_to_choices: page.responses_to_choices,
            background_image_url: page.background_image_url,
            background_image_alt_text: page.background_image_alt_text,
        })),
    };
}

function seedDialogue(db, users, stories, dialogue) {
    return db.transaction(async trx => {
        await seedUsers(db, users);
        await seedStories(db, stories);
        await trx.into('legendum_dialogue').insert(dialogue);
    });
};

function makeExercisesFixtures() {
    const stories = makeStoriesArray();

    const exercises = [1, 2, 3, 4].map(num => ({
        id: num,
        chapter_number: num,
        exercise_title: `Test Exercise ${num}`,
        exercise_translation: `Test Translation ${num}`,
    }));

    const learnPages = [1, 2, 3, 4].map(num => ({
        id: num,
        chapter_number: num,
        page: 1,
        text: `Test Text ${num}`,
        image_url: 'http://placehold.it/500x500',
        image_alt_text: `Test alt ${num}`,
        background_image_url: 'http://placehold.it/500x500',
        background_image_alt_text: `Test alt ${num}`,
    }));

    const learnHints = [1, 2, 3, 4].map(num => ({
        id: num,
        exercise_page_id: num,
        hint_order_number: 1,
        hint: `Hint Text ${num}`,
    }));

    const doPages = [
        {
            id: 1,
            chapter_number: 1,
            page: 1,
            dialogue: `Test Dialogue 1`,
            dialogue_look_back: false,
            dialogue_to_look_for: '',
            question_type: 'multiple-choice',
            question: 'Test question 1',
            incorrect_response_option_1: 'Incorrect test 1',
            incorrect_response_option_2: 'Incorrect test 2',
            incorrect_response_option_3: 'Incorrect test 3',
            correct_response: 'Correct test',
            response_if_incorrect_1: 'Incorrect 1',
            response_if_incorrect_2: 'Incorrect 2',
            response_if_incorrect_3: 'Incorrect 3',
            look_ahead: false,
            look_back: false,
            property_to_save: '',
            property_to_look_for: '', 
            image_url: 'http://placehold.it/500x500',
            image_alt_text: `Test alt 1`,
            background_image_url: 'http://placehold.it/500x500',
            background_image_alt_text: `Test alt 1`,
            input_label: '',
        },
        {
            id: 2,
            chapter_number: 2,
            page: 1,
            dialogue: `Test Dialogue 2`,
            dialogue_look_back: false,
            dialogue_to_look_for: '',
            question_type: 'input',
            question: 'Test question 2',
            incorrect_response_option_1: '',
            incorrect_response_option_2: '',
            incorrect_response_option_3: '',
            correct_response: 'Correct 2',
            response_if_incorrect_1: 'Incorrect 1',
            response_if_incorrect_2: '',
            response_if_incorrect_3: '',
            look_ahead: false,
            look_back: false,
            property_to_save: '',
            property_to_look_for: '', 
            image_url: 'http://placehold.it/500x500',
            image_alt_text: `Test alt 2`,
            background_image_url: 'http://placehold.it/500x500',
            background_image_alt_text: `Test alt 2`,
            input_label: 'Test Input Label',
        },
        {
            id: 3,
            chapter_number: 3,
            page: 1,
            dialogue: `Test Dialogue 3`,
            dialogue_look_back: false,
            dialogue_to_look_for: '',
            question_type: 'true/false',
            question: 'True or False? (Vērum aut Falsum?)',
            incorrect_response_option_1: 'False/Falsum',
            incorrect_response_option_2: '',
            incorrect_response_option_3: '',
            correct_response: 'True/Vērum',
            response_if_incorrect_1: 'Incorrect 1',
            response_if_incorrect_2: '',
            response_if_incorrect_3: '',
            look_ahead: false,
            look_back: false,
            property_to_save: '',
            property_to_look_for: '', 
            image_url: 'http://placehold.it/500x500',
            image_alt_text: `Test alt 3`,
            background_image_url: 'http://placehold.it/500x500',
            background_image_alt_text: `Test alt 3`,
            input_label: '',
        },
    ];

    return {
        stories,
        exercises,
        learnPages,
        learnHints,
        doPages,
    };
}

function makeMaliciousExerciseFixtures() {
    const maliciousStory = makeMaliciousStory();
    const maliciousExercise = {
        id: 911,
        chapter_number: 911,
        exercise_title: 'Naughty naughty very naughty <script>alert("xss");</script>',
        exercise_translation: 'Naughty naughty very naughty <script>alert("xss");</script>',
    };
    const maliciousLearnPage = {
        id: 911,
        chapter_number: 911,
        page: 911,
        text: 'Naughty naughty very naughty <script>alert("xss");</script>',
        image_url: 'Naughty naughty very naughty <script>alert("xss");</script>',
        image_alt_text: 'Naughty naughty very naughty <script>alert("xss");</script>',
        background_image_url: 'Naughty naughty very naughty <script>alert("xss");</script>',
        background_image_alt_text: 'Naughty naughty very naughty <script>alert("xss");</script>',
    };
    const maliciousHint = {
        id: 911,
        exercise_page_id: 911,
        hint_order_number: 911,
        hint: 'Naughty naughty very naughty <script>alert("xss");</script>',
    };
    const maliciousDoPage = {
        id: 911,
        chapter_number: 911,
        page: 911,
        dialogue: 'Naughty naughty very naughty <script>alert("xss");</script>',
        dialogue_look_back: false,
        dialogue_to_look_for: 'Naughty naughty very naughty <script>alert("xss");</script>',
        question_type: 'true/false',
        question: 'Naughty naughty very naughty <script>alert("xss");</script>',
        incorrect_response_option_1: 'Naughty naughty very naughty <script>alert("xss");</script>',
        incorrect_response_option_2: 'Naughty naughty very naughty <script>alert("xss");</script>',
        incorrect_response_option_3: 'Naughty naughty very naughty <script>alert("xss");</script>',
        correct_response: 'Naughty naughty very naughty <script>alert("xss");</script>',
        response_if_incorrect_1: 'Naughty naughty very naughty <script>alert("xss");</script>',
        response_if_incorrect_2: 'Naughty naughty very naughty <script>alert("xss");</script>',
        response_if_incorrect_3: 'Naughty naughty very naughty <script>alert("xss");</script>',
        look_ahead: false,
        look_back: false,
        property_to_save: 'Naughty naughty very naughty <script>alert("xss");</script>',
        property_to_look_for: 'Naughty naughty very naughty <script>alert("xss");</script>',
        image_url: 'Naughty naughty very naughty <script>alert("xss");</script>',
        image_alt_text: 'Naughty naughty very naughty <script>alert("xss");</script>',
        background_image_url: 'Naughty naughty very naughty <script>alert("xss");</script>',
        background_image_alt_text: 'Naughty naughty very naughty <script>alert("xss");</script>',
        input_label: 'Naughty naughty very naughty <script>alert("xss");</script>',
    };

    return {
        maliciousStory,
        maliciousExercise,
        maliciousLearnPage,
        maliciousHint,
        maliciousDoPage,
    };
}

function makeSanatizedExerciseFixtures() {
    const sanatizedStory = makeSanatizedStory();
    const sanatizedExercise = {
        id: 911,
        chapter_number: 911,
        exercise_title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        exercise_translation: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    };
    const sanatizedLearnPage = {
        id: 911,
        chapter_number: 911,
        page: 911,
        text: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        image_url: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        image_alt_text: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        background_image_url: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        background_image_alt_text: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    };
    const sanatizedHint = {
        id: 911,
        exercise_page_id: 911,
        hint_order_number: 911,
        hint: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    };
    const sanatizedDoPage = {
        id: 911,
        chapter_number: 911,
        page: 911,
        dialogue: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        dialogue_look_back: false,
        dialogue_to_look_for: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        question_type: 'true/false',
        question: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        incorrect_response_option_1: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        incorrect_response_option_2: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        incorrect_response_option_3: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        correct_response: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        response_if_incorrect_1: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        response_if_incorrect_2: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        response_if_incorrect_3: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        look_ahead: false,
        look_back: false,
        property_to_save: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        property_to_look_for: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        image_url: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        image_alt_text: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        background_image_url: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        background_image_alt_text: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        input_label: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    };

    return {
        sanatizedStory,
        sanatizedExercise,
        sanatizedLearnPage,
        sanatizedHint,
        sanatizedDoPage,
    };
}

function makeExpectedDoPage(doPage, exercise) {
    return {
        ...doPage,
        exercise_title: exercise.exercise_title,
        exercise_translation: exercise.exercise_translation,
    };
}

function seedExercises(db, users, stories, exercises) {
    return db.transaction(async trx => {
        await seedUsers(db, users);
        await seedStories(db, stories);
        await trx.into('legendum_exercises').insert(exercises);
    });
}

function seedLearnPages(db, users, stories, exercises, learnPages, hints) {
    return db.transaction(async trx => {
        await seedExercises(db, users, stories, exercises);
        await trx.into('legendum_exercises_learn').insert(learnPages);
        await trx.into('legendum_exercises_learn_hints').insert(hints);
    });
}

function seedDoPages(db, users, stories, exercises, doPages) {
    return db.transaction(async trx => {
        await seedExercises(db, users, stories, exercises);
        await trx.into('legendum_exercises_do').insert(doPages);
    });
}

function makeExpectedLearnPage(learnPage, exercise, hints) {
    return {
        id: learnPage.id,
        chapter_number: learnPage.chapter_number,
        page: learnPage.page,
        text: learnPage.text,
        image_url: learnPage.image_url,
        image_alt_text: learnPage.image_alt_text,
        background_image_url: learnPage.background_image_url,
        background_image_alt_text: learnPage.background_image_alt_text,
        exercise_title: exercise.exercise_title,
        exercise_translation: exercise.exercise_translation,
        hints: hints
            .filter(h => h.exercise_page_id === learnPage.id)
            .map(hint => ({
                id: hint.id,
                hint_order_number: hint.hint_order_number,
                hint: hint.hint,
            })),
    };
}

function makeNotes() {
    return [1, 2, 3, 4, 5, 6].map(num => ({
        id: num,
        hint_id: 1,
        custom_note: `Custom note ${num}`,
        date_modified: new Date().toJSON(),
        user_id: num % 2 === 0 ? 1 : 2,
    }));
}

function makeExpectedNote(note, learnHints, learnPages, exercises) {
    const hint = learnHints.find(h => h.id === note.hint_id);
    const learnPage = learnPages.find(p => hint.exercise_page_id === p.id);
    const exercise = exercises.find(e => e.chapter_number === learnPage.chapter_number);
    return {
        chapter_number: exercise.chapter_number,
        custom_note: note.custom_note,
        date_modified: note.date_modified,
        exercise_title: exercise.exercise_title,
        exercise_translation: exercise.exercise_translation,
        hint: hint.hint,
        hint_id: note.hint_id,
        id: note.id,
    };
}

function makeMaliciousNotesFixtures(userId) {
    const {
        maliciousStory,
        maliciousExercise,
        maliciousLearnPage,
        maliciousHint,
    } = makeMaliciousExerciseFixtures();

    const maliciousNote = {
        id: 911,
        hint_id: maliciousHint.id,
        custom_note: 'Naughty naughty very naughty <script>alert("xss");</script>',
        date_modified: new Date().toJSON(),
        user_id: userId,
    };

    return {
        maliciousStory,
        maliciousExercise,
        maliciousLearnPage,
        maliciousHint,
        maliciousNote,
    };
}

function makeSanatizedNote(note) {
    const {
        sanatizedExercise,
        sanatizedHint,
    } = makeSanatizedExerciseFixtures();

    return {
        chapter_number: sanatizedExercise.chapter_number,
        custom_note: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
        date_modified: note.date_modified,
        exercise_title: sanatizedExercise.exercise_title,
        exercise_translation: sanatizedExercise.exercise_translation,
        hint: sanatizedHint.hint,
        hint_id: note.hint_id,
        id: note.id,
    };
}

function seedNotesFixtures(db, users, stories, exercises, learnPages, hints, notes) {
    return db.transaction(async trx => {
        await seedLearnPages(db, users, stories, exercises, learnPages, hints);
        await trx.into('legendum_saved_notes').insert(notes);
    });
}

function makeProgressFixtures(testUsers) {
    const {
        stories,
        exercises,
    } = helpers.makeExercisesFixtures();

    const progress = [];

    exercises.forEach((e, i) => {
        testUsers.forEach((user, index) => {
            progress.push({
                id:  index + 1 + (i * testUsers.length),
                chapter_number: e.chapter_number,
                user_id: user.id,
                date_completed: new Date().toJSON(),
            });
        });
    });

    return {
        stories, 
        exercises,
        progress,
    };
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign(
        { user_id: user.id }, 
        secret, 
        {
            subject: user.user_name,
            algorithm: 'HS256',
        }
    );

    return `Bearer ${token}`;
}

module.exports = {
    cleanTables,
    makeUsersArray,
    makeUsersFixtures,
    seedUsers,
    makeAuthHeader,
    makeStoriesArray,
    makeMaliciousStory,
    seedStories,
    makeSanatizedStory,
    makeDialogueArray,
    seedDialogue,
    makeMaliciousDialogue,
    makeSanatizedDialogue,
    makeStoryDialogue,
    makeExercisesFixtures,
    seedExercises,
    makeMaliciousExerciseFixtures,
    makeSanatizedExerciseFixtures,
    makeExpectedLearnPage,
    seedLearnPages,
    seedDoPages,
    makeExpectedDoPage,
    makeNotes,
    seedNotesFixtures,
    makeExpectedNote,
    makeMaliciousNotesFixtures,
    makeSanatizedNote,
    makeProgressFixtures,
};
