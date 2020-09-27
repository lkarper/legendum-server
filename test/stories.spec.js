const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Stories endpoints', () => {
    let db;

    const testUsers = helpers.makeUsersArray();
    const stories = helpers.makeStoriesArray();

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

        const adminUser = testUsers[0];
        const nonAdminUser = testUsers[1];
        
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
