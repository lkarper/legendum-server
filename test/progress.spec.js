const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Progress endpoints', () => {
    let db;

    const testUsers = helpers.makeUsersArray();
    const testUser = testUsers[1];

    const {
        stories,
        exercises,
        progress,
    } = helpers.makeProgressFixtures(testUsers);

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

    describe('GET /api/progress', () => {
        context('Given that there is no auth header', () => {
            beforeEach('seed progress', () => helpers.seedProgress(db, testUsers, stories, exercises, progress));
            it('responds with 401 and an error message', () => {
                return supertest(app)
                    .get('/api/progress')
                    .expect(401, {
                        error: 'Missing bearer token',
                    });
            });
        });

        context('Given that there is an auth header', () => {
            context('Given that the user has no saved progress', () => {
                beforeEach('seed exercises', () => helpers.seedProgress(db, testUsers, stories, exercises, []));
                it('responds with 200 and an empty array', () => {
                    return supertest(app)
                        .get('/api/progress')
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(200, []);
                });
            });

            context('Given that the user has saved progress', () => {
                beforeEach('seed progress', () => helpers.seedProgress(db, testUsers, stories, exercises, progress));
                it(`responds with 200 and a user's saved progress`, () => {
                    const expectedProgress = progress
                        .filter(p => p.user_id === testUser.id)
                        .map(p => helpers.makeExpectedProgress(p, exercises));
                    return supertest(app)
                        .get('/api/progress')
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(200, expectedProgress);
                });
            });
        });
    });

    describe('POST /api/exercises', () => {
        beforeEach('seed exercises', () => helpers.seedExercises(db, testUsers, stories, exercises));
        const newProgress = {
            chapter_number: 1,
        };

        context('Given that there is no auth header', () => {
            it('responds with 401 and an error message', () => {
                return supertest(app)
                    .post('/api/progress')
                    .send(newProgress)
                    .expect(401, {
                        error: `Missing bearer token`,
                    });
            });
        });
        
        context('Given that there is an auth header', () => {
            context('Given that chapter_number is missing from the request body', () => {
                it('responds with 400 and an error message', () => {
                    return supertest(app)
                        .post('/api/progress')
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .send({})
                        .expect(400, {
                            error: `Missing 'chapter_number' in request body`,
                        });
                });
            });
            
            context('Given that the chapter with chapter_number does not exist', () => {
                it('responds with 404 and an error message', () => {
                    return supertest(app)
                        .post('/api/progress')
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .send({ chapter_number: 1000 })
                        .expect(404, {
                            error: `Exercise not found`,
                        });
                });
            });

            context('Given that the chapter with chapter_number does exist', () => {
                it('responds with 201 and creates a progress entry', function() {
                    this.retries(3);

                    const newProgress = {
                        chapter_number: 1,
                    };
                    const exercise = exercises.find(e => e.chapter_number === newProgress.chapter_number);

                    return supertest(app)
                        .post('/api/progress')
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .send(newProgress)
                        .expect(201)
                        .expect(res => {
                            expect(res.body).to.have.property('id');
                            expect(res.headers.location).to.eql(`/api/progress/${res.body.id}`);
                            expect(res.body.chapter_number).to.eql(newProgress.chapter_number);
                            const expectedDate = new Date().toLocaleString()
                            const actualDate = new Date(res.body.date_completed).toLocaleString()
                            expect(actualDate).to.eql(expectedDate);
                            expect(res.body.exercise_title).to.eql(exercise.exercise_title);
                            expect(res.body.exercise_translation).to.eql(exercise.exercise_translation);
                        })
                        .then(postRes => 
                            supertest(app)
                                .get(`/api/progress/${postRes.body.id}`)
                                .set('Authorization', helpers.makeAuthHeader(testUser))
                                .expect(res => {
                                    expect(res.body.id).to.eql(postRes.body.id);
                                    expect(res.body.chapter_number).to.eql(newProgress.chapter_number);
                                    const expectedDate = new Date().toLocaleString()
                                    const actualDate = new Date(res.body.date_completed).toLocaleString()
                                    expect(actualDate).to.eql(expectedDate);
                                    expect(res.body.exercise_title).to.eql(exercise.exercise_title);
                                    expect(res.body.exercise_translation).to.eql(exercise.exercise_translation);                                        
                                })    
                        );
                });
            });
        });
    });

    describe('GET /api/progress/:progress_id', () => {
        beforeEach('seed progress', () => helpers.seedProgress(db, testUsers, stories, exercises, progress));
        context('Given that there is no auth header', () => {
            it('responds with 401 and an error message', () => {
                return supertest(app)
                    .get('/api/progress/1')
                    .expect(401, {
                        error: 'Missing bearer token',
                    });
            });
        });

        context('Given that there is an auth header', () => {
            context('Given that the progress entry with id equal to progress_id does not exist', () => {
                it('responds with 404 and an error message', () => {
                    return supertest(app)
                        .get('/api/progress/1000')
                        .set('Authorization', helpers.makeAuthHeader(testUser))
                        .expect(404, {
                            error: 'Progress record not found',
                        });
                });
            });

            context('Given that the progress entry with id equal to progress_id does exist', () => {
                context('Given that the user does not own the requested progress entry', () => {
                    it('responds with 401 and an error message', () => {
                        const progressNotBelongingToUser = progress.find(p => p.user_id !== testUser.id);
                        return supertest(app)
                            .get(`/api/progress/${progressNotBelongingToUser.id}`)
                            .set('Authorization', helpers.makeAuthHeader(testUser))
                            .expect(401, {
                                error: `Unauthorized request`,
                            });
                    });
                });

                context('Given that the user does own the request progress entry', () => {
                    it('responds with 200 and the requested progress entry', () => {
                        const progressBelongingToUser = progress.find(p => p.user_id === testUser.id);
                        const expectedProgress = helpers.makeExpectedProgress(progressBelongingToUser, exercises);
                        return supertest(app)
                            .get(`/api/progress/${progressBelongingToUser.id}`)
                            .set('Authorization', helpers.makeAuthHeader(testUser))
                            .expect(200, expectedProgress);
                    });
                });
            });
        });
    });
});
