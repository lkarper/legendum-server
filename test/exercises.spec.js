const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Exercises endpoints', () => {
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

    describe('GET /api/exercises/:chapter_number/learn-pages/:page_id', () => {
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

    describe('DELETE /api/exercises/:chapter_number/learn-pages/:page_id', () => {
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

    describe('PATCH /api/exercises/:chapter_number/learn-pages/:page_id', () => {
        context('Given that the chapter does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .patch('/api/exercises/1/learn-pages/1')
                    .send({ text: 'TEST' })
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
                    .patch('/api/exercises/1/learn-pages/1')
                    .send({ text: 'TEST' })
                    .expect(404, {
                        error: `Exercise learn page not found`,
                    });
            });
        });

        context('Given that the chapter and the Learn Page exist', () => {
            beforeEach('seed Learn Pages', () => helpers.seedLearnPages(db, testUsers, stories, exercises, learnPages, learnHints));
            
            context('Given that there is no auth header', () => {
                it('responds with 401 and an error message', () => {
                    return supertest(app)
                        .patch('/api/exercises/1/learn-pages/1')
                        .send({ text: 'TEST' })
                        .expect(401, {
                            error: `Missing bearer token`,
                        });
                });
            });

            context('Given that there is an auth header', () => {
                context('Given that the user does not have admin privileges', () => {
                    it('responds with 401 and an error message', () => {
                        return supertest(app)
                            .patch('/api/exercises/1/learn-pages/1')
                            .set('Authorization', helpers.makeAuthHeader(nonAdminUser))
                            .send({ text: 'TEST' })
                            .expect(401, {
                                error: 'This account does not have admin privileges',
                            });
                    });
                });
                
                context('Given that the user has admin privileges', () => {
                    context('Given that there are no fields in the request body', () => {
                        it('responds with 400 and an error message', () => {
                            return supertest(app)
                                .patch('/api/exercises/1/learn-pages/1')
                                .set('Authorization', helpers.makeAuthHeader(adminUser))
                                .send({})
                                .expect(400, {
                                    error: `Request body must contain one of 'page', 'text', 'image_url', 'image_alt_text', 'background_image_url', 'background_image_alt_text'.`,
                                });
                        });
                    }); 
                    
                    context('Given fields in the request body', () => {
                        it('responds with 204 and updates the resource', () => {
                            const updatedLearnPage = {
                                page: 100,
                                text: 'Updated',
                                image_url: 'updated.image.com/',
                                image_alt_text: 'updated alt text',
                                background_image_url: 'updated.image.background.com/',
                                background_image_alt_text: 'updated alt text'
                            };
                            const newLearnPage = { ...learnPages[0], ...updatedLearnPage };
                            const exercise = exercises.find(exercise => exercise.chapter_number === 1);
                            const expectedLearnPage = helpers.makeExpectedLearnPage(newLearnPage, exercise, learnHints);
                            
                            return supertest(app)
                                .patch(`/api/exercises/1/learn-pages/${newLearnPage.id}`)
                                .set('Authorization', helpers.makeAuthHeader(adminUser))
                                .send(updatedLearnPage)
                                .expect(204)
                                .then(() =>
                                    supertest(app)
                                        .get(`/api/exercises/1/learn-pages/${newLearnPage.id}`)
                                        .expect(200, expectedLearnPage) 
                                );
                        });
                    });
                });
            });            
        });
    });

    describe('GET /api/exercises/:chapter_number/learn-pages/:page_id/hints', () => {
        context('Given that the chapter does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .get('/api/exercises/1/learn-pages/1/hints')
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
                    .get('/api/exercises/1/learn-pages/1/hints')
                    .expect(404, {
                        error: `Exercise learn page not found`,
                    });
            });
        });

        context('Given that the chapter and the Learn Page exist', () => {
            context('Given that there are no hints for a Learn Page', () => {
                beforeEach('seed learn pages', () => helpers.seedLearnPages(db, testUsers, stories, exercises, learnPages, []));
                it('responds with 200 and an empty array', () => {
                    return supertest(app)
                        .get('/api/exercises/1/learn-pages/1/hints')
                        .expect(200, []);
                });
            });

            context('Given that there are hints for a Learn Page', () => {
                beforeEach('seed learn pages', () => helpers.seedLearnPages(db, testUsers, stories, exercises, learnPages, learnHints));
                it('responds with 200 and the hints for the page', () => {
                    const learnPage = learnPages[0];
                    const expectedHints = learnHints.filter(h => h.exercise_page_id === learnPage.id);
                    return supertest(app)
                        .get('/api/exercises/1/learn-pages/1/hints')
                        .expect(200, expectedHints);
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
                sanatizedHint,
            } = helpers.makeSanatizedExerciseFixtures();

            before('seed malicious content', () => 
                helpers.seedLearnPages(db, testUsers, maliciousStory, maliciousExercise, maliciousLearnPage, maliciousHint)
            );

            it('responds with 200 and sanatized hints', () => {
                return supertest(app)
                    .get(`/api/exercises/${maliciousExercise.chapter_number}/learn-pages/${maliciousLearnPage.id}/hints`)
                    .expect(200, [sanatizedHint]); 
            });
        });
    });
    
    describe('POST /api/exercises/:chapter_number/learn-pages/:page_id/hints', () => {
        const newHint = {
            id: 1,
            exercise_page_id: 1,
            hint_order_number: 1,
            hint: 'Test Hint',
        };

        context('Given that the chapter does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .post('/api/exercises/1/learn-pages/1/hints')
                    .set('Authorization', helpers.makeAuthHeader(adminUser))
                    .send(newHint)
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
                    .post('/api/exercises/1/learn-pages/1/hints')
                    .set('Authorization', helpers.makeAuthHeader(adminUser))
                    .send(newHint)
                    .expect(404, {
                        error: `Exercise learn page not found`,
                    });
            });
        });

        context('Given that the chapter and Learn Page exist', () => {
            beforeEach('seed Learn Pages', () => helpers.seedLearnPages(db, testUsers, stories, exercises, learnPages, []));
            context('Given that there is no auth header', () => {
                it('returns 401 and an error message', () => {
                    return supertest(app)
                        .post('/api/exercises/1/learn-pages/1/hints')
                        .send(newHint)
                        .expect(401, {
                            error: `Missing bearer token`,
                        });
                });              
            });

            context('Given that there is an auth header', () => {
                context('Given that the user does not have admin privileges', () => {
                    it('responds with 401 and an error message', () => {
                        return supertest(app)
                            .post('/api/exercises/1/learn-pages/1/hints')
                            .set('Authorization', helpers.makeAuthHeader(nonAdminUser))
                            .send(newHint)
                            .expect(401, {
                                error: 'This account does not have admin privileges',
                            });
                    });
                });

                context('Given that the user does have admin privileges', () => {
                    const requiredFields = [
                        'hint_order_number',
                        'hint',
                    ];

                    requiredFields.forEach(field => {
                        const postAttempt = { ...newHint };
                        delete postAttempt[field];

                        it(`responds with 400 when '${field}' is missing`, () => {
                            return supertest(app)
                                .post(`/api/exercises/1/learn-pages/1/hints`)
                                .set('Authorization', helpers.makeAuthHeader(adminUser))
                                .send(postAttempt)
                                .expect(400, {
                                    error: `Missing '${field}' in request body`,
                                });
                        });
                    });

                    context('Given that the request body is complete', () => {
                        it('responds with 201 and creates a hint', () => {
                            return supertest(app)
                                .post(`/api/exercises/1/learn-pages/1/hints`)
                                .set('Authorization', helpers.makeAuthHeader(adminUser))
                                .send(newHint)
                                .expect(201)
                                .expect(res => {
                                    expect(res.body).to.have.property('id');
                                    expect(res.header.location).to.eql(`/api/exercises/1/learn-pages/1/hints/${res.body.id}`);
                                    expect(res.body.exercise_page_id).to.eql(1);
                                    expect(res.body.hint_order_number).to.eql(newHint.hint_order_number);
                                    expect(res.body.hint).to.eql(newHint.hint);
                                })
                                .then(postRes =>
                                    supertest(app)
                                        .get(`/api/exercises/1/learn-pages/1/hints/${postRes.body.id}`)
                                        .expect(200, {
                                            ...newHint,
                                            exercise_page_id: 1
                                        })
                                );
                        });
                    });
                });
            });
        });
    });

    describe('GET /api/exercises/:chapter_number/learn-pages/:page_id/hints/:hint_id', () => {
        context('Given that the chapter does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .get('/api/exercises/1/learn-pages/1/hints/1')
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
                    .get('/api/exercises/1/learn-pages/1/hints/1')
                    .expect(404, {
                        error: `Exercise learn page not found`,
                    });
            });
        });

        context('Given that the chapter and Learn Page exist', () => {
            beforeEach('seed Learn Pages', () => helpers.seedLearnPages(db, testUsers, stories, exercises, learnPages, learnHints));
            context('Given that the hint does not exist', () => {
                it('responds with 404 and an error message', () => {
                    return supertest(app)
                        .get('/api/exercises/1/learn-pages/1/hints/1000')
                        .expect(404, {
                            error: 'Hint not found',
                        });
                });
            });

            context('Given that the hint exists', () => {
                it('responds with 200 and the hint with id equal to hint_id', () => {
                    const hint = learnHints[0];
                    return supertest(app)
                        .get(`/api/exercises/1/learn-pages/1/hints/${hint.id}`)
                        .expect(200, hint);
                });
            });
        });
    });

    describe('DELETE /api/exercises/:chapter_number/learn-pages/:page_id/hints/:hint_id', () => {
        context('Given that the chapter does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .delete('/api/exercises/1/learn-pages/1/hints/1')
                    .set('Authorization', helpers.makeAuthHeader(adminUser))
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
                    .delete('/api/exercises/1/learn-pages/1/hints/1')
                    .set('Authorization', helpers.makeAuthHeader(adminUser))
                    .expect(404, {
                        error: `Exercise learn page not found`,
                    });
            });
        });

        context('Given that the chapter and Learn Page exist', () => {
            context('Given that the hint does not exist', () => {
                beforeEach('seed Learn Pages', () => helpers.seedLearnPages(db, testUsers, stories, exercises, learnPages, learnHints));
                it('responds with 404 and an error message', () => {
                    return supertest(app)
                        .delete('/api/exercises/1/learn-pages/1/hints/1000')
                        .expect(404, {
                            error: 'Hint not found',
                        });
                });
            });

            context('Given that the hint does exist', () => {
                beforeEach('seed Learn Pages', () => helpers.seedLearnPages(db, testUsers, stories, exercises, learnPages, learnHints));
                context('Given that there is no auth header', () => {
                    it('responds with 401 and an error message', () => {
                        return supertest(app)
                            .delete('/api/exercises/1/learn-pages/1/hints/1')
                            .expect(401, {
                                error: 'Missing bearer token', 
                            });
                    });
                });

                context('Given that there is an auth header', () => {
                    context('Given that the user does not have admin privileges', () => {
                        it('responds with 401 and an error message', () => {
                            return supertest(app)
                                .delete('/api/exercises/1/learn-pages/1/hints/1')
                                .set('Authorization', helpers.makeAuthHeader(nonAdminUser))
                                .expect(401, {
                                    error: 'This account does not have admin privileges', 
                                });
                        });
                    });

                    context('Given that the user does have admin privileges', () => {
                        it('responds with 204 and removes the requested hint', () => {
                            const hintToDelete = learnHints[0];
                            const expectedHints = learnHints.filter(h => h.id !== hintToDelete.id && h.exercise_page_id === hintToDelete.exercise_page_id);
                            return supertest(app)
                                .delete(`/api/exercises/1/learn-pages/1/hints/${hintToDelete.id}`)
                                .set('Authorization', helpers.makeAuthHeader(adminUser))
                                .expect(204)
                                .then(() =>
                                    supertest(app)
                                        .get('/api/exercises/1/learn-pages/1/hints')
                                        .expect(200, expectedHints)
                                );
                        });
                    });
                });
            });
        });
    });

    describe('PATCH /api/exercises/:chapter_number/learn-pages/:page_id/hints/:hint_id', () => {
        context('Given that the chapter does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .patch('/api/exercises/1/learn-pages/1/hints/1')
                    .set('Authorization', helpers.makeAuthHeader(adminUser))
                    .send({ hint: 'TEST' })
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
                    .patch('/api/exercises/1/learn-pages/1/hints/1')
                    .set('Authorization', helpers.makeAuthHeader(adminUser))
                    .send({ hint: 'TEST' })
                    .expect(404, {
                        error: `Exercise learn page not found`,
                    });
            });
        });

        context('Given that the chapter and the Learn Page exist', () => {
            context('Given that the hint does not exist', () => {
                beforeEach('seed Learn pages', () => helpers.seedLearnPages(db, testUsers, stories, exercises, learnPages, []));
                it('responds with 404 and an error message', () => {
                    return supertest(app)
                        .patch('/api/exercises/1/learn-pages/1/hints/1')
                        .set('Authorization', helpers.makeAuthHeader(adminUser))
                        .send({ hint: 'TEST' })
                        .expect(404, {
                            error: 'Hint not found',
                        });
                });
            });

            context('Given that the hint does exist', () => {
                beforeEach('seed Learn Pages and hints', () => helpers.seedLearnPages(db, testUsers, stories, exercises, learnPages, learnHints));
                
                context('Given that there is no auth header', () => {
                    it('responds with 401 and an error message', () => {
                        return supertest(app)
                            .patch('/api/exercises/1/learn-pages/1/hints/1')
                            .send({ hint: 'TEST' })
                            .expect(401, {
                                error: 'Missing bearer token', 
                            });
                    });
                });

                context('Given that there is an auth header', () => {
                    context('Given that the user does not have admin privileges', () => {
                        it('responds with 401 and an error message', () => {
                            return supertest(app)
                                .patch('/api/exercises/1/learn-pages/1/hints/1')
                                .set('Authorization', helpers.makeAuthHeader(nonAdminUser))
                                .send({ hint: 'TEST' })
                                .expect(401, {
                                    error: 'This account does not have admin privileges', 
                                });
                        });
                    });

                    context('Given that the user does have admin privileges', () => {
                        context('Given that the request body is empty', () => {
                            it('responds with 400 and an error message', () => {
                                return supertest(app)
                                    .patch('/api/exercises/1/learn-pages/1/hints/1')
                                    .set('Authorization', helpers.makeAuthHeader(adminUser))
                                    .send({})
                                    .expect(400, {
                                        error: `Request body must contain one of 'hint_order_number' or 'hint'.`,
                                    });
                            });
                        });

                        context('Given that the request body is properly formatted', () => {
                            it('responds with 204 and updates the hint', () => {
                                const hintToUpdate = learnHints[0];
                                const hintUpdates = {
                                    hint_order_number: 2,
                                    hint: 'Updated', 
                                };
                                const expectedHint = { 
                                    ...hintToUpdate, 
                                    ...hintUpdates 
                                };
                                return supertest(app)
                                    .patch(`/api/exercises/1/learn-pages/1/hints/${hintToUpdate.id}`)
                                    .set('Authorization', helpers.makeAuthHeader(adminUser))
                                    .send(hintUpdates)
                                    .expect(204)
                                    .then(() =>
                                        supertest(app)
                                            .get(`/api/exercises/1/learn-pages/1/hints/${hintToUpdate.id}`)
                                            .expect(200, expectedHint)
                                    );
                            });
                        });
                    });
                });
            });
        });
    });

    describe('GET /api/exercises/:chapter_number/do-pages', () => {
        context('Given that the chapter with chapter_number does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .get('/api/exercises/1/do-pages')
                    .expect(404, {
                        error: {
                            message: `Chapter doesn't exist`,
                        },
                    });
            });
        });

        context('Given that the chapter with chapter_number does exist', () => {
            context('Given that there are no Do Pages for a chapter', () => {
                beforeEach('seed exercises', () => helpers.seedExercises(db, testUsers, stories, exercises));
                it('responds with 200 and an empty array', () => {
                    return supertest(app)
                        .get('/api/exercises/1/do-pages')
                        .expect(200, []);
                });
            });

            context('Given that there are Do Pages for a chapter', () => {
                beforeEach('seed Do Pages', () => helpers.seedDoPages(db, testUsers, stories, exercises, doPages));
                it('responds with 200 and the Do Pages for a chapter', () => {
                    const chapterNumber = 1;
                    const exercise = exercises.find(e => e.chapter_number === chapterNumber);
                    const pages = doPages.filter(p => p.chapter_number === chapterNumber);
                    const expectedResponse = pages.map(p => helpers.makeExpectedDoPage(p, exercise));
                    return supertest(app)
                        .get(`/api/exercises/${chapterNumber}/do-pages`)
                        .expect(200, expectedResponse);
                });
            });

            context('Given an XSS attack', () => {
                const {
                    maliciousStory,
                    maliciousExercise,
                    maliciousDoPage,
                } = helpers.makeMaliciousExerciseFixtures();

                beforeEach('seed malicious Do Pages', () => 
                    helpers.seedDoPages(db, testUsers, maliciousStory, maliciousExercise, maliciousDoPage)
                );
                it('responds with 200 and sanatized content', () => {
                    const {
                        sanatizedExercise,
                        sanatizedDoPage,
                    } = helpers.makeSanatizedExerciseFixtures();
                    const expectedResponse = helpers.makeExpectedDoPage(sanatizedDoPage, sanatizedExercise);
                    return supertest(app)
                        .get(`/api/exercises/${maliciousExercise.chapter_number}/do-pages`)
                        .expect(200, [expectedResponse]);
                });
            });
        });
    });

    describe('POST /api/exercises/:chapter_number/do-pages', () => {
        const exercise = exercises[0];
        const newDoPage = doPages[0];

        context('Given that the chapter does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .post(`/api/exercises/${exercise.chapter_number}/do-pages`)
                    .set('Authorization', helpers.makeAuthHeader(adminUser))
                    .send(newDoPage)
                    .expect(404, {
                        error: {
                            message: `Chapter doesn't exist`,
                        },
                    });
            });
        });

        context('Given that the chapter does exist', () => {
            beforeEach('seed exercises', () => helpers.seedExercises(db, testUsers, stories, exercises));
            context('Given that there is no auth header', () => {
                it('responds with 401 and an error message', () => {
                    return supertest(app)
                        .post(`/api/exercises/${exercise.id}/do-pages`)
                        .send(newDoPage)
                        .expect(401, {
                            error: 'Missing bearer token', 
                        });
                });
            });

            context('Given that there is an auth header', () => {
                context('Given that the user does not have admin privileges', () => {
                    it('responds with 401 and an error message', () => {
                        return supertest(app)
                            .post(`/api/exercises/${exercise.id}/do-pages`)
                            .set('Authorization', helpers.makeAuthHeader(nonAdminUser))
                            .send(newDoPage)
                            .expect(401, {
                                error: 'This account does not have admin privileges', 
                            });
                    });
                });

                context('Given that the user does have admin privileges', () => {
                    const requiredFields = [
                        'page',
                        'question_type',
                        'question',
                    ];

                    requiredFields.forEach(field => {
                        const postAttempt = { ...newDoPage };
                        delete postAttempt[field];

                        it(`responds with 400 and an error message when '${field}' is missing from the request body`, () => {
                            return supertest(app)
                                .post(`/api/exercises/${exercise.chapter_number}/do-pages`)
                                .set('Authorization', helpers.makeAuthHeader(adminUser))
                                .send(postAttempt)
                                .expect(400, {
                                    error: `Missing '${field}' in request body`,
                                });
                        });
                    });
                });

                context('Given that the user does have admin privileges', () => {
                    it('responds with 201 and creates a new Do Page', () => {
                        const expectedResponse = helpers.makeExpectedDoPage(newDoPage, exercise);
                        return supertest(app)
                            .post(`/api/exercises/${exercise.chapter_number}/do-pages`)
                            .set('Authorization', helpers.makeAuthHeader(adminUser))
                            .send(newDoPage)
                            .expect(201)
                            .expect(res => {
                                expect(res.body).to.have.property('id');
                                expect(res.headers.location).to.eql(`/api/exercises/${exercise.chapter_number}/do-pages/${res.body.id}`);
                                expect(res.body.chapter_number).to.eql(expectedResponse.chapter_number);
                                expect(res.body.page).to.eql(expectedResponse.page);
                                expect(res.body.dialogue).to.eql(expectedResponse.dialogue);
                                expect(res.body.dialogue_look_back).to.eql(expectedResponse.dialogue_look_back);
                                expect(res.body.dialogue_to_look_for).to.eql(expectedResponse.dialogue_to_look_for);
                                expect(res.body.question_type).to.eql(expectedResponse.question_type);
                                expect(res.body.question).to.eql(expectedResponse.question);
                                expect(res.body.incorrect_response_option_1).to.eql(expectedResponse.incorrect_response_option_1);
                                expect(res.body.incorrect_response_option_2).to.eql(expectedResponse.incorrect_response_option_2);
                                expect(res.body.incorrect_response_option_3).to.eql(expectedResponse.incorrect_response_option_3);
                                expect(res.body.correct_response).to.eql(expectedResponse.correct_response);
                                expect(res.body.response_if_incorrect_1).to.eql(expectedResponse.response_if_incorrect_1);                                
                                expect(res.body.response_if_incorrect_2).to.eql(expectedResponse.response_if_incorrect_2);                                
                                expect(res.body.response_if_incorrect_3).to.eql(expectedResponse.response_if_incorrect_3);
                                expect(res.body.look_ahead).to.eql(expectedResponse.look_ahead);
                                expect(res.body.look_back).to.eql(expectedResponse.look_back);
                                expect(res.body.property_to_save).to.eql(expectedResponse.property_to_save);
                                expect(res.body.property_to_look_for).to.eql(expectedResponse.property_to_look_for);
                                expect(res.body.image_url).to.eql(expectedResponse.image_url);
                                expect(res.body.image_alt_text).to.eql(expectedResponse.image_alt_text);
                                expect(res.body.background_image_url).to.eql(expectedResponse.background_image_url);
                                expect(res.body.background_image_alt_text).to.eql(expectedResponse.background_image_alt_text);
                                expect(res.body.input_label).to.eql(expectedResponse.input_label);
                                expect(res.body.exercise_title).to.eql(expectedResponse.exercise_title);
                                expect(res.body.exercise_translation).to.eql(expectedResponse.exercise_translation);                           
                            })
                            .then(postRes =>
                                supertest(app)
                                    .get(`/api/exercises/${postRes.body.chapter_number}/do-pages/${postRes.body.id}`)
                                    .expect(200, expectedResponse)
                            );
                    });
                });
            });
        });
    });

    describe('GET /api/exercises/:chapter_number/do-pages/:page_id', () => {
        context('Given that the chapter with chapter_number does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .get('/api/exercises/1/do-pages/1')
                    .expect(404, {
                        error: {
                            message: `Chapter doesn't exist`,
                        },
                    });
            });
        });

        context('Given that the chapter with chapter_number does exist', () => {
            context('Given that the Do Page does not exist', () => {
                beforeEach('seed exercises', () => helpers.seedExercises(db, testUsers, stories, exercises));
                it('responds with 404 and an error message', () => {
                    return supertest(app)
                        .get('/api/exercises/1/do-pages/1')
                        .expect(404, {
                            error: `Exercise do page not found`,
                        });
                });
            });

            context('Given that the Do Page with id equal to page_id does exist', () => {
                beforeEach('seed Do pages', () => helpers.seedDoPages(db, testUsers, stories, exercises, doPages));
                it('responds with 200 and the Do Page with id equal to page_id', () => {
                    const exercise = exercises[0];
                    const doPage = doPages[0];
                    const expectedResponse = helpers.makeExpectedDoPage(doPage, exercise);
                    return supertest(app)
                        .get(`/api/exercises/${exercise.chapter_number}/do-pages/${doPage.id}`)
                        .expect(200, expectedResponse);
                });
            });
        });
    });

    describe('DELETE /api/exercises/:chapter_number/do-pages/:page_id', () => {
        context('Given that the chapter with chapter_number does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .delete('/api/exercises/1/do-pages/1')
                    .set('Authorization', helpers.makeAuthHeader(adminUser))
                    .expect(404, {
                        error: {
                            message: `Chapter doesn't exist`,
                        },
                    });
            });
        });

        context('Given that the chapter with chapter_number does exist', () => {
            context('Given that the Do Page with page_id does not exist', () => {
                beforeEach('seed exercises', () => helpers.seedExercises(db, testUsers, stories, exercises));
                it('responds with 404 and an error message', () => {
                    return supertest(app)
                        .delete(`/api/exercises/1/do-pages/1`)
                        .set('Authorization', helpers.makeAuthHeader(adminUser))
                        .expect(404, {
                            error: 'Exercise do page not found', 
                        });
                });
            });

            context('Given that the do page with page_id does exist', () => {
                beforeEach('seed Do pages', () => helpers.seedDoPages(db, testUsers, stories, exercises, doPages));
                const exercise = exercises[0];
                const doPageToDelete = doPages[0];

                context('Given that there is no auth header', () => {
                    it('responds with 401 and an error message', () => {
                        return supertest(app)
                            .delete(`/api/exercises/${exercise.chapter_number}/do-pages/${doPageToDelete.id}`)
                            .expect(401, {
                                error: 'Missing bearer token', 
                            });
                    });
                });

                context('Given that there is an auth header', () => {
                    context('Given that the user does not have admin privileges', () => {
                        it('responds with 401 and an error message', () => {
                            return supertest(app)
                            .delete(`/api/exercises/${exercise.chapter_number}/do-pages/${doPageToDelete.id}`)
                            .set('Authorization', helpers.makeAuthHeader(nonAdminUser))
                            .expect(401, {
                                error: 'This account does not have admin privileges', 
                            });
                        });
                    });

                    context('Given that the user does have admin privileges', () => {
                        it('responds with 204 and removes the Do Page', () => {
                            const expectedResults = doPages
                                .filter(p => p.id !== doPageToDelete.id && p.chapter_number === exercise.chapter_number)
                                .map(p => helpers.makeExpectedDoPage(p, exercise));

                            return supertest(app)
                                .delete(`/api/exercises/${exercise.chapter_number}/do-pages/${doPageToDelete.id}`)
                                .set('Authorization', helpers.makeAuthHeader(adminUser))
                                .expect(204)
                                .then(() =>
                                    supertest(app)
                                        .get(`/api/exercises/${exercise.chapter_number}/do-pages`)
                                        .expect(200, expectedResults)
                                );
                        });
                    });
                });
            });
        });
    });

    describe('PATCH /api/exercises/:chapter_number/do-pages/:page_id', () =>{
        context('Given that the chapter does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .patch('/api/exercises/1/do-pages/1')
                    .set('Authorization', helpers.makeAuthHeader(adminUser))
                    .send({ dialogue: 'Updated' })
                    .expect(404, {
                        error: {
                            message: `Chapter doesn't exist`,
                        },
                    });
            });
        });

        context('Given that the chapter does exist', () => {
            beforeEach('seed Do Pages', () => helpers.seedDoPages(db, testUsers, stories, exercises, doPages));
            
            context('Given that the Do Page with page_id does not exist', () => {
                it('responds with 404 and an error message', () => {
                    return supertest(app)
                        .patch('/api/exercises/1/do-pages/100')
                        .set('Authorization', helpers.makeAuthHeader(adminUser))
                        .send({ dialogue: 'Updated' })
                        .expect(404, {
                            error: `Exercise do page not found`,
                        });
                });
            });

            context('Given that the Do Page with page_id does exist', () => {
                context('Given that there is no auth header', () => {
                    it('responds with 401 and an error message', () => {
                        return supertest(app)
                            .patch('/api/exercises/1/do-pages/1')
                            .send({ dialogue: 'Updated' })
                            .expect(401, {
                                error: 'Missing bearer token', 
                            });
                    });
                });

                context('Given that there is an auth header', () => {
                    context('Given that the user does not have admin privileges', () => {
                        it('responds with 401 and an error message', () => {
                            return supertest(app)
                                .patch('/api/exercises/1/do-pages/1')
                                .set('Authorization', helpers.makeAuthHeader(nonAdminUser))
                                .send({ dialogue: 'Updated' })
                                .expect(401, {
                                    error: 'This account does not have admin privileges',
                                });
                        });
                    });

                    context('Given that the user does have admin privileges', () => {
                        it('responds with 204 and updates the Do Page', () => {
                            const exercise = exercises[0];
                            const doPageToUpdate = doPages[0];
                            const doPageUpdates = {
                                page: 2,
                                dialogue: `Updated Dialogue 1`,
                                dialogue_look_back: true,
                                dialogue_to_look_for: 'Updated',
                                question_type: 'multiple-choice',
                                question: 'Updated question 1',
                                incorrect_response_option_1: 'Incorrect updated 1',
                                incorrect_response_option_2: 'Incorrect updated 2',
                                incorrect_response_option_3: 'Incorrect updated 3',
                                correct_response: 'Correct updated',
                                response_if_incorrect_1: 'Incorrect up 1',
                                response_if_incorrect_2: 'Incorrect up 2',
                                response_if_incorrect_3: 'Incorrect up 3',
                                look_ahead: true,
                                look_back: true,
                                property_to_save: 'update',
                                property_to_look_for: 'update', 
                                image_url: 'http://placehold.it/500x500/update',
                                image_alt_text: `Test alt 1`,
                                background_image_url: 'http://placehold.it/500x500/update',
                                background_image_alt_text: `Test alt updated 1`,
                                input_label: '',
                            };
                            const expectedPage = helpers.makeExpectedDoPage({ ...doPageToUpdate, ...doPageUpdates }, exercise);

                            return supertest(app)
                                .patch(`/api/exercises/${exercise.chapter_number}/do-pages/${doPageToUpdate.id}`)
                                .set('Authorization', helpers.makeAuthHeader(adminUser))
                                .send(doPageUpdates)
                                .expect(204)
                                .then(() =>
                                    supertest(app)
                                        .get(`/api/exercises/${exercise.chapter_number}/do-pages/${doPageToUpdate.id}`)
                                        .expect(200, expectedPage)
                                );
                        });
                    });
                });
            });
        });
    });
});
