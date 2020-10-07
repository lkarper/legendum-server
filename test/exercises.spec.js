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

    describe('GET /api/exercises/:chapter_number/learn-pages', () => {
        context('Given that the chapter with chapter_number does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .get('/api/exercises/1/learn-pages')
                    .expect(404, {
                        error: {
                            message: `Chapter doesn't exist`,
                        },
                    });
            });
        });

        context('Given that the chapter with chapter_number does exist', () => {
            context('Given that there are no learn pages for the chapter', () => {
                beforeEach('seed exercises', () => helpers.seedExercises(db, testUsers, stories, exercises));
                it('responds with 200 and an empty array', () => {
                    return supertest(app)
                        .get('/api/exercises/1/learn-pages')
                        .expect(200, []);
                });
            });
            
            context('Given that there are learn pages for the chapter', () => {
                beforeEach('seed exercise fixtures', () => 
                    helpers.seedLearnPages(db, testUsers, stories, exercises, learnPages, learnHints)
                );

                it('responds with 200 and learn pages for the chapter', () => {
                    const exercise = exercises.find(exercise => exercise.chapter_number === 1);
                    const expectedLearnPages = learnPages
                        .filter(p => p.chapter_number === 1)
                        .map(page => helpers.makeExpectedLearnPage(page, exercise, learnHints));

                    return supertest(app)
                        .get('/api/exercises/1/learn-pages')
                        .expect(200, expectedLearnPages);
                });
            });
        });

        context('Given an XSS attack', () => {
            const {
                maliciousStory,
                maliciousExercise,
                maliciousLearnPage,
                maliciousHint,
            } = helpers.makeMaliciousExerciseFixtures();
            const {
                sanatizedExercise,
                sanatizedLearnPage,
                sanatizedHint,
            } = helpers.makeSanatizedExerciseFixtures();

            before('seed malicious content', () => 
                helpers.seedLearnPages(db, testUsers, maliciousStory, maliciousExercise, maliciousLearnPage, maliciousHint)
            );

            it('returns 200 and sanatized content', () => {
                const expectedResult = helpers.makeExpectedLearnPage(sanatizedLearnPage, sanatizedExercise, [sanatizedHint]);
                return supertest(app)
                    .get(`/api/exercises/${maliciousExercise.chapter_number}/learn-pages`)
                    .expect(200, [expectedResult]);
            });
        });
    });

    describe('POST /api/exercises/:chapter_number/learn-pages', () => {
        const newLearnPage = learnPages[0];
        context('Given that the chapter with chapter_number does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                .post('/api/exercises/1/learn-pages')
                .send(newLearnPage)
                .expect(404, {
                    error: {
                        message: `Chapter doesn't exist`,
                    },
                });
            });
        });

        context('Given that the chapter with chapter_number does exist', () => {
            beforeEach('seed exercises', () => helpers.seedExercises(db, testUsers, stories, exercises));
            context('Given that there is no auth header', () => {
                it('responds with 401 and an error message', () => {
                    return supertest(app)
                        .post('/api/exercises/1/learn-pages')
                        .send(newLearnPage)
                        .expect(401, {
                            error: `Missing bearer token`,
                        });
                });
            });
            
            context('Given that there is an auth header', () => {
                context('Given that the user does not have admin privileges', () => {
                    it('responds 401 and an error message', () => {
                        return supertest(app)
                            .post('/api/exercises/1/learn-pages')
                            .set('Authorization', helpers.makeAuthHeader(nonAdminUser))
                            .send(newLearnPage)
                            .expect(401, {
                                error: 'This account does not have admin privileges',
                            });
                    });
                });

                context('Given that the user does have admin privileges', () => {
                    const requiredFields = [
                        'page',
                        'text',
                    ];
                    
                    requiredFields.forEach(field => {
                        const postAttempt = { ...newLearnPage };
                        delete postAttempt[field];
                        it(`responds with 400 when '${field}' is missing`, () => {
                            return supertest(app)
                                .post('/api/exercises/1/learn-pages')
                                .set('Authorization', helpers.makeAuthHeader(adminUser))
                                .send(postAttempt)
                                .expect(400, {
                                    error: `Missing '${field}' in request body`,
                                });
                        });
                    });
                    
                    context('Given that the request body is complete', () => {
                        it('responds with 201 and creates a new learn page', () => {
                            const exercise = exercises.find(e => e.chapter_number === 1);
                            const expectedLearnPage = helpers.makeExpectedLearnPage(newLearnPage, exercise, []);
                            return supertest(app)
                                .post(`/api/exercises/${exercise.chapter_number}/learn-pages`)
                                .set('Authorization', helpers.makeAuthHeader(adminUser))
                                .send(newLearnPage)
                                .expect(201)
                                .expect(res => {
                                    expect(res.body).to.have.property('id');
                                    expect(res.headers.location).to.eql(`/api/exercises/${exercise.chapter_number}/learn-pages/${res.body.id}`);
                                    expect(res.body.page).to.eql(expectedLearnPage.page);
                                    expect(res.body.text).to.eql(expectedLearnPage.text);
                                    expect(res.body.image_url).to.eql(expectedLearnPage.image_url);
                                    expect(res.body.alt_text).to.eql(expectedLearnPage.alt_text);
                                    expect(res.body.background_image_url).to.eql(expectedLearnPage.background_image_url);
                                    expect(res.body.background_image_alt_text).to.eql(expectedLearnPage.background_image_alt_text);
                                    expect(res.body.exercise_title).to.eql(expectedLearnPage.exercise_title);
                                    expect(res.body.exercise_translation).to.eql(expectedLearnPage.exercise_translation);
                                    expect(res.body.hints).to.eql([]);
                                })
                                .then(postRes => 
                                    supertest(app)
                                        .get(`/api/exercises/${exercise.chapter_number}/learn-pages/${postRes.body.id}`)
                                        .expect(200, expectedLearnPage)
                                );
                        });
                    });
                });
            });
        });
    });

    describe('GET /:chapter_number/learn-pages/:page_id', () => {
        context('Given that the chapter does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .get('/api/exercises/1/learn-pages/1')
                    .expect(404, {
                        error: {
                            message: `Chapter doesn't exist`,
                        },
                    });
            });
        });

        context('Given that the chapter exists, but the Learn Page does not', () => {
            beforeEach('seed exercises', () => helpers.seedExercises(db, testUsers, stories, exercises));
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .get('/api/exercises/1/learn-pages/1')
                    .expect(404, {
                        error: `Exercise learn page not found`,
                    });
            });
        });

        context('Given that the chapter and the Learn Page exist', () => {
            beforeEach('seed learn pages', () => helpers.seedLearnPages(db, testUsers, stories, exercises, learnPages, learnHints));
            it('responds with 200 and the Learn Page with id equal to page_id', () => {
                const exercise = exercises.find(e => e.chapter_number === 1);
                const page = learnPages[0];
                const expectedPage = helpers.makeExpectedLearnPage(page, exercise, learnHints);
                return supertest(app)
                    .get(`/api/exercises/${exercise.chapter_number}/learn-pages/${page.id}`)
                    .expect(200, expectedPage);
            });
        });
    });

    describe('DELETE /:chapter_number/learn-pages/:page_id', () => {
        context('Given that the chapter does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .delete('/api/exercises/1/learn-pages/1')
                    .expect(404, {
                        error: {
                            message: `Chapter doesn't exist`,
                        },
                    });
            });
        });

        context('Given that the chapter exists, but the Learn Page does not', () => {
            beforeEach('seed exercises', () => helpers.seedExercises(db, testUsers, stories, exercises));
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .delete('/api/exercises/1/learn-pages/1')
                    .expect(404, {
                        error: `Exercise learn page not found`,
                    });
            });
        });

        context('Given that the chapter and Learn Page both exist', () => {
            beforeEach('seed learn pages', () => helpers.seedLearnPages(db, testUsers, stories, exercises, learnPages, learnHints));
            context('Given that there is no auth header', () => {
                context('Given that there is no auth header', () => {
                    it('responds with 401 and an error message', () => {
                        return supertest(app)
                            .delete('/api/exercises/1/learn-pages/1')
                            .expect(401, {
                                error: `Missing bearer token`,
                            });
                    });
                });

                context('Given that there is an auth header', () => {
                    context('Given that the user does not have admin privileges', () => {
                        it('responds 401 and an error message', () => {
                            return supertest(app)
                                .delete('/api/exercises/1/learn-pages/1')
                                .set('Authorization', helpers.makeAuthHeader(nonAdminUser))
                                .expect(401, {
                                    error: 'This account does not have admin privileges',
                                });
                        });
                    });

                    context('Given that the user does have admin privileges', () => {
                        it('responds with 204 and deletes the Learn Page', () => {
                            const learnPageToDelete = learnPages[0];
                            const exercise = exercises.find(exercise => exercise.chapter_number === 1);
                            const expectedLearnPages = learnPages
                                .filter(p => p.chapter_number === 1 && p.id !== learnPageToDelete.id)
                                .map(page => helpers.makeExpectedLearnPage(page, exercise, learnHints));
                            return supertest(app)
                                .delete(`/api/exercises/${learnPageToDelete.chapter_number}/learn-pages/${learnPageToDelete.id}`)
                                .set('Authorization', helpers.makeAuthHeader(adminUser))
                                .expect(204)
                                .then(() =>
                                    supertest(app)
                                        .get(`/api/exercises/${learnPageToDelete.chapter_number}/learn-pages`)
                                        .expect(200, expectedLearnPages)
                                );
                        });
                    });
                });
            });
        });
    });
});
