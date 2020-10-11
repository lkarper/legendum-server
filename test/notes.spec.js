const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const { makeExpectedNote } = require('./test-helpers');
const helpers = require('./test-helpers');

describe('Notes endpoints', () => {
    let db;

    const testUsers = helpers.makeUsersArray();
    const testUser = testUsers[1];

    const {
        stories,
        exercises,
        learnPages,
        learnHints,
    } = helpers.makeExercisesFixtures();

    const testNotes = helpers.makeNotes();

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        });
        app.set('db', db);
    });  

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));
    
    afterEach('cleanup', () => helpers.cleanTables(db));

    describe('GET /api/notes', () => {
        context('Given that there is no auth header', () => {
            it('responds with 401 and an error message', () => {
                return supertest(app)
                    .get('/api/notes')
                    .expect(401, {
                        error: 'Missing bearer token',
                    });
            });
        });

        context('Given that there is an auth header', () => {
            context('Given that there are no saved notes for a user', () => {
                beforeEach('seed Learn Pages', () => helpers.seedLearnPages(db, testUsers, stories, exercises, learnPages, learnHints));
                it('responds with 200 and an empty array', () => {
                    return supertest(app)
                        .get('/api/notes')
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(200, []);
                });
            });

            context('Given that there are saved notes for a user', () => {
                beforeEach('seed Notes Fixtures', () => helpers.seedNotesFixtures(db, testUsers, stories, exercises, learnPages, learnHints, testNotes));
                it('responds with 200 and the notes for a user', () => {
                    const expectedNotes = testNotes
                        .filter(n => n.user_id === testUser.id)
                        .map(n => makeExpectedNote(n, learnHints, learnPages, exercises));
                    return supertest(app)
                        .get('/api/notes')
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(200, expectedNotes);
                });
            });

            context('Given an XSS attack', () => {
                const {
                    maliciousStory,
                    maliciousExercise,
                    maliciousLearnPage,
                    maliciousHint,
                    maliciousNote,
                } = helpers.makeMaliciousNotesFixtures(testUser.id);
                
                beforeEach('seed malicious Notes fixtures', () => helpers.seedNotesFixtures(db, testUsers, maliciousStory, maliciousExercise, maliciousLearnPage, maliciousHint, maliciousNote));
                it('responds with 200 and sanatized notes for the user', () => {
                    const sanatizedNote = helpers.makeSanatizedNote(maliciousNote);
                    return supertest(app)
                        .get('/api/notes')
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(200, [sanatizedNote]);
                });
            });
        });
    });
});
