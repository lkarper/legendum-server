const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Stories endpoints', () => {
    let db;

    const testUsers = helpers.makeUsersArray();
    const stories = helpers.makeStoriesArray();
    
    const adminUser = testUsers[0];
    const nonAdminUser = testUsers[1];

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

    describe('GET /api/stories', () => {
        context('Given no stories', () => {
            it('responds 200 and empty array', () => {
                return supertest(app)
                    .get('/api/stories')
                    .expect(200, []);
            });
        });

        context('Given there are stories in the db', () => {
            beforeEach('seed stories', () => helpers.seedStories(db, stories));
            it('responds with 200 and all stories', () => {
                return supertest(app)
                    .get('/api/stories')
                    .expect(200, stories);
            });
        });

        context('Given an xss attack', () => {
            beforeEach('seed malicious story', () => {
                const story = helpers.makeMaliciousStory();
                return helpers.seedStories(db, story);
            });

            it('removes xss content', () => {
                const expectedContent = helpers.makeSanatizedStory();
                return supertest(app)
                    .get('/api/stories')
                    .expect(200, [expectedContent]);
            });
        });
    });

    describe('POST /api/stories', () => {
        beforeEach('seed users', () => helpers.seedUsers(db, testUsers));
        
        const newStory = {
            id: 1,
            story_title: 'Test title',
            chapter_number: 1,
        };
        
        context('Given that there is no auth header', () => {
            it('responds with 401 and an error message', () => {
                return supertest(app)
                    .post('/api/stories')
                    .send(newStory)
                    .expect(401, {
                        error: 'Missing bearer token',
                    });
            });
        });

        context('Given that there is an auth header', () => {
            context('Given that the user does not have admin privileges', () => {
                it('responds with 401 and an error message', () => {
                    return supertest(app)
                        .post('/api/stories')
                        .set('Authorization', helpers.makeAuthHeader(nonAdminUser))
                        .send(newStory)
                        .expect(401, {
                            error: 'This account does not have admin privileges',
                        });                    
                });
            });

            context('Given that the user does have admin privileges', () => {
                ['story_title', 'chapter_number'].forEach(field => {
                    const postAttemptBody = { ...newStory };

                    it(`responds 400 require error when '${field}' is missing`, () => {
                        delete postAttemptBody[field];
                        return supertest(app)
                            .post('/api/stories')
                            .set('Authorization', helpers.makeAuthHeader(adminUser))
                            .send(postAttemptBody)
                            .expect(400, {
                                error: `Missing '${field}' in request body`
                            });
                    });
                });
                
                context('Given that a chapter number is already in use', () => {
                    beforeEach('seed stories', () => helpers.seedStories(db, stories));
                    it('responds with 400 and an error message', () => {
                        const storyWithChapterNumberAlreadyInUse = {
                            story_title: 'TEST',
                            chapter_number: 1,
                        };

                        return supertest(app)
                            .post('/api/stories')
                            .send(storyWithChapterNumberAlreadyInUse)
                            .set('Authorization', helpers.makeAuthHeader(adminUser))
                            .expect(400, { error: `Chapter number is already in use` });
                    });
                });

                context('Given that a chapter number is not already in use', () => {
                    it('responds 201 and creates a new story', () => {
                        return supertest(app)
                            .post('/api/stories')
                            .set('Authorization', helpers.makeAuthHeader(adminUser))
                            .send(newStory)
                            .expect(201)
                            .expect(res => {
                                expect(res.headers.location).to.eql(`/api/stories/${res.body.id}`);
                                expect(res.body).to.have.property('id');
                                expect(res.body.story_title).to.eql(newStory.story_title);
                                expect(res.body.chapter_number).to.eql(newStory.chapter_number);
                            })
                            .then(postRes =>
                                supertest(app)
                                    .get(`/api/stories/${postRes.body.id}`)
                                    .expect(200, newStory)    
                            );
                    });    
                });
            });
        });
    });

    describe('GET /api/stories/by-chapter/:chapter_number', () => {
        context('Given that the story with requested chapter number does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .get('/api/stories/by-chapter/1')
                    .expect(404, {
                        error: `Chapter doesn't exist`,
                    });
            });
        });

        context('Given that the story with requested chapter number does exist', () => {
            beforeEach('seed stories', () => helpers.seedStories(db, stories));
            it('responds with 200 and the requested story', () => {
                const testStory = stories.find(story => story.chapter_number === 1);
                return supertest(app)
                    .get(`/api/stories/by-chapter/${testStory.chapter_number}`)
                    .expect(200, testStory);
            });
        });
    });

    describe('GET /api/stories/:story_id', () => {
        context('Given that the story with requested id does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .get('/api/stories/1')
                    .expect(404, {
                        error: {
                            message: `Story doesn't exist`,
                        },
                    });
            });
        });

        context('Given that the story with requested id does exit', () => {
            beforeEach('seed stories', () => helpers.seedStories(db, stories));

            it('responds with 200 and requested story', () => {
                const testStory = stories[0];
                return supertest(app)
                    .get(`/api/stories/${testStory.id}`)
                    .expect(200, testStory);
            });
        });
    });

    describe('DELETE /api/stories/:story_id', () => {
        context('Given that the story with requested id does not exist', () => {
            it('responds with 404 and error message', () => {
                return supertest(app)
                    .delete('/api/stories/1')
                    .expect(404, {
                        error: {
                            message: `Story doesn't exist`,
                        },
                    });
            });
        });

        context('Given that the story with requested id exists', () => {
            beforeEach('seed stories', () => helpers.seedStories(db, stories));
            beforeEach('seed user', () => helpers.seedUsers(db, testUsers));
            const testStory = stories[0];

            context('Given that there is no auth header', () => {
                it('responds with 401 and an error message', () => {
                    return supertest(app)
                        .delete(`/api/stories/${testStory.id}`)
                        .expect(401, { error: `Missing bearer token` });
                });
            });

            context('Given that there is an auth header', () => {
                context('Given that the user does not have admin privileges', () => {
                    it('responds with 401 and an error message', () => {
                        return supertest(app)
                            .delete(`/api/stories/${testStory.id}`)
                            .set('Authorization', helpers.makeAuthHeader(nonAdminUser))
                            .expect(401,  {
                                error: 'This account does not have admin privileges',
                            });
                    });
                });

                context('Given that the user does have admin privileges', () => {
                    it('responds with 204 and removes the story', () => {
                        const idToRemove = testStory.id;
                        const expectedStories = stories.filter(story => story.id !== idToRemove);

                        return supertest(app)
                            .delete(`/api/stories/${idToRemove}`)
                            .set('Authorization', helpers.makeAuthHeader(adminUser))
                            .expect(204)
                            .expect(res => 
                                supertest(app)
                                    .get(`/api/stories`)
                                    .expect(200, expectedStories)
                            );
                    });
                });
            });
        });
    });

    describe('PATCH /api/stories/:story_id', () => {
        context('Given that the story with requested id does not exist', () => {
            it('responds with 404 and an error message', () => {
                return supertest(app)
                    .patch('/api/stories/1')
                    .expect(404, {
                        error: {
                            message: `Story doesn't exist`,
                        },
                    });
            });
        });

        context('Given that the story does exist', () => {
            beforeEach('seed stories', () => helpers.seedStories(db, stories));
            beforeEach('seed users', () => helpers.seedUsers(db, testUsers));

            context('Given that there is no auth header', () => {
                it('responds with 401 and an error message', () => {
                    return supertest(app)
                        .patch('/api/stories/1')
                        .send({ story_title: 'TEST UPDATE'})
                        .expect(401, {
                            error: 'Missing bearer token',
                        });
                });
            });

            context('Given that there is an auth header', () => {
                context('Given that the user has no admin privileges', () => {
                    it('responds with 401 and an error message', () => {
                        return supertest(app)
                            .patch('/api/stories/1')
                            .send({ story_title: 'TEST UPDATE' })
                            .set('Authorization', helpers.makeAuthHeader(nonAdminUser))
                            .expect(401, {
                                error: 'This account does not have admin privileges',
                            });
                    });
                });

                context('Given that the user has admin privileges', () => {
                    context('Given that there are no update fields', () => {
                        it('responds with 400 and an error message', () => {
                            return supertest(app)
                                .patch('/api/stories/1')
                                .set('Authorization', helpers.makeAuthHeader(adminUser))
                                .send({ })
                                .expect(400, {
                                    error: {
                                        message: `Request body must contain one of 'story_title' or 'chapter_number'`,
                                    },
                                });
                        });
                    });

                    context('Given that there are update fields', () => {
                        context('Given that a chapter number is already in use', () => {
                            it('responds with 400 and an error message', () => {
                                return supertest(app)
                                    .patch('/api/stories/1')
                                    .set('Authorization', helpers.makeAuthHeader(adminUser))
                                    .send({ chapter_number: 2 })
                                    .expect(400, { error: `Chapter number is already in use` });
                            });
                        });

                        context('Given that a chapter number is not already in use', () => {
                            it('responds with 204 and updates the story', () => {
                                return supertest(app)
                                    .patch('/api/stories/1')
                                    .set('Authorization', helpers.makeAuthHeader(adminUser))
                                    .send({ 
                                        story_title: 'TEST UPDATE',
                                        chapter_number: 40
                                    })
                                    .expect(204)
                                    .expect(res =>
                                        supertest(app)
                                            .get('/api/stories/1')
                                            .expect(res => {
                                                expect(res.body).to.have.property('id');
                                                expect(res.body.story_title).to.eql('TEST UPDATE');
                                                expect(res.body.chapter_number).to.eql(40);
                                            })
                                    );
                            });    
                        });                        
                    });
                });
            });
        });
    });
});
