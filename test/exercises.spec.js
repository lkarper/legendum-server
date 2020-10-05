const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Exercises endpoints', () => {
    let db;

    const testUsers = helpers.makeUsersArray();
    
    const adminUser = testUsers[0];
    const nonAdminUser = testUsers[1];

    const {
        stories,
        exercises,
        learnPages,
        learnHints,
        doPages,
    } = helpers.makeExercisesFixtures();

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

    describe('GET /api/exercises', () => {
        context('Given no exercises', () => {
            it('responds 200 and an empty array', () => {
                return supertest(app)
                    .get('/api/exercises')
                    .expect(200, []);
            });
        });

        context('Given there are exercises in the db', () => {
            beforeEach('seed exercises', () => helpers.seedExercises(db, testUsers, stories, exercises));
            it('responds with 200 and all the exercises', () => {
                return supertest(app)
                    .get('/api/exercises')
                    .expect(200, exercises);
            });
        });

        context('Given an XSS attack', () => {
            const {
                maliciousStory,
                maliciousExercise,
            } = helpers.makeMaliciousExerciseFixtures();
            beforeEach('seed malicious content', () => 
                helpers.seedExercises(db, testUsers, maliciousStory, maliciousExercise)
            );
            
            it('responds with 200 and sanatized content', () => {
                const { sanatizedExercise } = helpers.makeSanatizedExerciseFixtures();
                return supertest(app)
                    .get('/api/exercises')
                    .expect(200, [sanatizedExercise]);
            });
        });
    });

    describe.only('POST /api/exercises', () => {
        const newExercise = exercises[0];

        context('Given that there is no auth header', () => {
            it('responds with 401 and an error message', () => {
                return supertest(app)
                    .post('/api/exercises')
                    .send(newExercise)
                    .expect(401, {
                        error: `Missing bearer token`,
                    });
            });
        });

        context('Given that there is an auth header', () => {
            context('Given that the user does not have admin privileges', () => {
                before('seed users', () => helpers.seedUsers(db, testUsers));
                before('seed stories', () => helpers.seedStories(db, stories));
                it('responds 401 and an error message', () => {
                    return supertest(app)
                        .post('/api/exercises')
                        .set('Authorization', helpers.makeAuthHeader(nonAdminUser))
                        .send(newExercise)
                        .expect(401, {
                            error: 'This account does not have admin privileges',
                        });
                });
            });
        });

        context('Given that the user does have admin privileges', () => {
            beforeEach('seed users', () => helpers.seedUsers(db, testUsers));
            beforeEach('seed stories', () => helpers.seedStories(db, stories));

            context('Given that the chapter number does not exist', () => {
                it('responds with 404 and an error message', () => {
                    const postAttempt = { ...newExercise, chapter_number: 1000 };
                    return supertest(app)
                        .post('/api/exercises')
                        .set('Authorization', helpers.makeAuthHeader(adminUser))
                        .send(postAttempt)
                        .expect(404, {
                            error: `Chapter doesn't exist`,
                        });
                });
            });

            context('Given that the chapter number does exist', () => {
                const requiredFields = [
                    'chapter_number',
                    'exercise_title', 
                    'exercise_translation',
                ];

                requiredFields.forEach(field => {
                    const postAttempt = { ...newExercise };
                    delete postAttempt[field];

                    it(`responds with 400 and an error message when '${field}' is missing`, () => {
                        return supertest(app)
                            .post('/api/exercises')
                            .set('Authorization', helpers.makeAuthHeader(adminUser))
                            .send(postAttempt)
                            .expect(400, {
                                error: `Missing '${field}' in request body`,
                            });
                    });
                });

                context('Given that the request field is complete', () => {
                    it('responds with 201 and creates a new exercise', () => {
                        return supertest(app)
                            .post('/api/exercises')
                            .set('Authorization', helpers.makeAuthHeader(adminUser))
                            .send(newExercise)
                            .expect(201)
                            .expect(res => {
                                expect(res.headers.location).to.eql(`/api/exercises/${res.body.id}`);
                                expect(res.body).to.have.property('id');
                                expect(res.body.chapter_number).to.eql(newExercise.chapter_number);
                                expect(res.body.exercise_title).to.eql(newExercise.exercise_title);
                                expect(res.body.exercise_translation).to.eql(newExercise.exercise_translation);
                            })
                            .then(postRes =>
                                supertest(app)
                                    .get(`/api/exercises/${postRes.body.id}`)
                                    .expect(res => {
                                        expect(res.body.id).to.eql(postRes.body.id);
                                        expect(res.body.chapter_number).to.eql(newExercise.chapter_number);
                                        expect(res.body.exercise_title).to.eql(newExercise.exercise_title);
                                        expect(res.body.exercise_translation).to.eql(newExercise.exercise_translation);
                                    })
                            );
                    });
                });
            });
        });
    });
});
