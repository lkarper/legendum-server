const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Notes endpoints', () => {
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
                        .map(n => helpers.makeExpectedNote(n, learnHints, learnPages, exercises));
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

    describe('POST /api/notes', () => {
        const newNote = {
            hint_id: 1,
            custom_note: 'Posted custom note',
        };

        beforeEach('seed Learn Pages', () => helpers.seedLearnPages(db, testUsers, stories, exercises, learnPages, learnHints));

        context('Given that there is no auth header', () => {
            it('responds with 401 and an error message', () => {
                return supertest(app)
                    .post('/api/notes')
                    .send(newNote)
                    .expect(401, {
                        error: 'Missing bearer token',
                    });
            });
        });

        context('Given that there is an auth header', () => {
            context('Given that hint_id is missing from the request', () => {
                it('responds with 400 and an error message', () => {
                    const postAttempt = { ...newNote };
                    delete postAttempt['hint_id'];

                    return supertest(app)
                        .post('/api/notes')
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .send(postAttempt)
                        .expect(400, {
                            error: `Missing 'hint_id' in request body`,
                        });
                });
            });

            context('Given that the request body is complete', () => {
                it('responds with 201 and creates a new note', function() {
                    this.retries(3);
                    
                    const hint = learnHints.find(h => h.id === newNote.hint_id);
                    const learnPage = learnPages.find(p => hint.exercise_page_id === p.id);
                    const exercise = exercises.find(e => e.chapter_number === learnPage.chapter_number);

                    return supertest(app)
                        .post('/api/notes')
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .send(newNote)
                        .expect(201)
                        .expect(res => {
                            expect(res.body).to.have.property('id');
                            expect(res.header.location).to.eql(`/api/notes/${res.body.id}`);
                            expect(res.body.chapter_number).to.eql(exercise.chapter_number);
                            expect(res.body.custom_note).to.eql(newNote.custom_note);
                            const expectedDate = new Date().toLocaleString()
                            const actualDate = new Date(res.body.date_modified).toLocaleString()
                            expect(actualDate).to.eql(expectedDate);
                            expect(res.body.exercise_title).to.eql(exercise.exercise_title);
                            expect(res.body.exercise_translation).to.eql(exercise.exercise_translation);
                            expect(res.body.hint).to.eql(hint.hint);
                            expect(res.body.hint_id).to.eql(newNote.hint_id);
                        })
                        .then(postRes =>
                            supertest(app)
                                .get(`/api/notes/${postRes.body.id}`)
                                .set('Authorization', helpers.makeAuthHeader(testUser))
                                .expect(res => {
                                    expect(res.body.id).to.eql(postRes.body.id);
                                    expect(res.body.chapter_number).to.eql(exercise.chapter_number);
                                    expect(res.body.custom_note).to.eql(newNote.custom_note);
                                    const expectedDate = new Date().toLocaleString()
                                    const actualDate = new Date(res.body.date_modified).toLocaleString()
                                    expect(actualDate).to.eql(expectedDate);
                                    expect(res.body.exercise_title).to.eql(exercise.exercise_title);
                                    expect(res.body.exercise_translation).to.eql(exercise.exercise_translation);
                                    expect(res.body.hint).to.eql(hint.hint);
                                    expect(res.body.hint_id).to.eql(newNote.hint_id);
                                })    
                        );
                });
            });
        });
    });
});
