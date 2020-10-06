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

    describe('POST /api/exercises', () => {
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
            context('Given that the chapter number does not exist', () => {
                beforeEach('seed users', () => helpers.seedUsers(db, testUsers));
                beforeEach('seed stories', () => helpers.seedStories(db, stories));
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
                context('Given an incorrectly formed request body', () => {
                    beforeEach('seed users', () => helpers.seedUsers(db, testUsers));
                    beforeEach('seed stories', () => helpers.seedStories(db, stories));
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
                });
            
                context('Given that the request field is complete', () => {
                    context('Given that the chapter_number is already in use', () => {
                        before('seed exercises', () => helpers.seedExercises(db, testUsers, stories, exercises));
                        const postAttempt = { ...newExercise };
                        it('responds with 400 and an error message', () => {
                            return supertest(app)
                                .post('/api/exercises')
                                .set('Authorization', helpers.makeAuthHeader(adminUser))
                                .send(postAttempt)
                                .expect(400, {
                                    error: `Chapter number is already in use`,
                                });
                        });
                    });

                    context('Given that the chapter_number is not in use', () => {
                        beforeEach('seed users', () => helpers.seedUsers(db, testUsers));
                        beforeEach('seed stories', () => helpers.seedStories(db, stories));
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

    describe('GET /api/exercises/:exercise_id', () => {
        context('Given that the exercise with exercise_id does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                .get('/api/exercises/1')
                .expect(404, {
                    error: {
                        message: `Exercise doesn't exist`,
                    },
                });
            });
        });

        context('Given that the exercise with exercise_id does exist', () => {
            before('seed exercises', () => helpers.seedExercises(db, testUsers, stories, exercises));
            it('responds with 200 and the exercise', () => {
                const testExercise = exercises[0];
                return supertest(app)
                    .get(`/api/exercises/${testExercise.id}`)
                    .expect(200, testExercise);
            });
        });
    });

    describe('DELETE /api/exercises/:exercise_id', () => {
        context('Given that the exercise with exercise_id does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                .delete('/api/exercises/1')
                .expect(404, {
                    error: {
                        message: `Exercise doesn't exist`,
                    },
                });
            });
        });

        context('Given that the exercise with exercise_id does exist', () => {
            beforeEach('seed exercises', () => helpers.seedExercises(db, testUsers, stories, exercises));

            context('Given that there is no auth header', () => {
                it('responds with 401 and an error message', () => {
                    return supertest(app)
                        .delete('/api/exercises/1')
                        .expect(401, {
                            error: 'Missing bearer token',
                        });
                });
            });

            context('Given that there is an auth header', () => {
                context('Given that the user does not have admin privileges', () => {
                    it('responds with 401 and an error message', () => {
                        return supertest(app)
                            .delete('/api/exercises/1')
                            .set('Authorization', helpers.makeAuthHeader(nonAdminUser))
                            .expect(401, {
                                error: 'This account does not have admin privileges',
                            });
                    });
                });

                context('Given that the user does have admin privileges', () => {
                    it('responds with 204 and removes the exercise', () => {
                        const exerciseToRemove = exercises[0];
                        const expectedExercises = exercises.filter(e => e.id !== exerciseToRemove.id);
                        return supertest(app)
                            .delete(`/api/exercises/${exerciseToRemove.id}`)
                            .set('Authorization', helpers.makeAuthHeader(adminUser))
                            .expect(204)
                            .then(() => 
                                supertest(app)
                                    .get('/api/exercises')
                                    .expect(200, expectedExercises)
                            );
                    });
                });
            });
        });        
    });

    describe('PATCH /api/exercises/:exercise_id', () => {
        context('Given that the exercise with exercise_id does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                .patch('/api/exercises/1')
                .send({ exercise_title: 'Update' })
                .expect(404, {
                    error: {
                        message: `Exercise doesn't exist`,
                    },
                });
            });
        });

        context('Given that the exercise with exercise_id does exist', () => {
            beforeEach('seed exercises', () => helpers.seedExercises(db, testUsers, stories, exercises));
            
            context('Given that there is no auth header', () => {
                it('responds with 401 and an error message', () => {
                    return supertest(app)
                        .patch('/api/exercises/1')
                        .send({ exercise_title: 'Update' })
                        .expect(401, {
                            error: 'Missing bearer token',
                        });
                });
            });

            context('Given that there is an auth header', () => {
                context('Given that the user does not have admin privileges', () => {
                    it('responds with 401 and an error message', () => {
                        return supertest(app)
                            .patch('/api/exercises/1')
                            .set('Authorization', helpers.makeAuthHeader(nonAdminUser))
                            .send({ exercise_title: 'Update' })
                            .expect(401, {
                                error: 'This account does not have admin privileges',
                            });
                    });
                });

                context('Given that the user does have admin privileges', () => {
                    context('Given that the chapter number does not exist', () => {
                        it('responds with 404 and an error message', () => {
                            return supertest(app)
                                .patch('/api/exercises/1')
                                .set('Authorization', helpers.makeAuthHeader(adminUser))
                                .send({ chapter_number: 1000 })
                                .expect(404, {
                                    error: `Chapter doesn't exist`,
                                });
                        });
                    });

                    context('Given that the chapter number does exist', () => {
                        context('Given that the chapter_number is already in use', () => {
                            it('responds with 400 and an error message', () => {
                                return supertest(app)
                                    .patch('/api/exercises/1')
                                    .set('Authorization', helpers.makeAuthHeader(adminUser))
                                    .send({ chapter_number: 2 })
                                    .expect(400, {
                                        error: `Chapter number is already in use`,
                                    });
                            });
                        });

                        it('responds with 204 and updates the exercise', () => {
                            const updatedExercise = {
                                id: 1,
                                chapter_number: 1,
                                exercise_title: 'Updated',
                                exercise_translation: 'Updated',
                            };

                            return supertest(app)
                                .patch(`/api/exercises/${updatedExercise.id}`)
                                .set('Authorization', helpers.makeAuthHeader(adminUser))
                                .send(updatedExercise)
                                .expect(204)
                                .then(() => 
                                    supertest(app)
                                        .get(`/api/exercises/${updatedExercise.id}`)
                                        .expect(200, updatedExercise)
                                );
                        });
                    });
                });
            });
        });
    });
});
