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
};
