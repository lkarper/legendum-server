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

module.exports = {
    cleanTables,
    makeUsersArray,
    makeUsersFixtures,
    seedUsers,
};
