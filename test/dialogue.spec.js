const { expect } = require('chai');
const knex = require('knex');
const supertest = require('supertest');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe.only('Dialogue endpoints', () => {
    let db;

    const testUsers = helpers.makeUsersArray();
    const {
        stories,
        dialogue,
    } = helpers.makeDialogueArray();
    
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

    describe('GET /api/dialogue', () => {
        context('Given no dialogue', () => {
            it('responds 200 and an empty array', () => {
                return supertest(app)
                    .get('/api/dialogue')
                    .expect(200, []);
            });
        });

        context('Given there is dialogue in the db', () => {
            beforeEach('seed dialogue', () => helpers.seedDialogue(db, testUsers, stories, dialogue));
            it('responds with 200 and all dialogue', () => {
                return supertest(app)
                    .get('/api/dialogue')
                    .expect(200, dialogue);
            });
        });

        context('Given an xss attack', () => {
            const {
                maliciousStory,
                maliciousDialogue,
            } = helpers.makeMaliciousDialogue();
            beforeEach('seed malicious content', () => 
                helpers.seedDialogue(db, testUsers, maliciousStory, maliciousDialogue)
            );

            it('responds with 200 and sanatized content', () => {
                const { sanatizedDialogue } = helpers.makeSanatizedDialogue();
                return supertest(app)
                    .get('/api/dialogue')
                    .expect(200, [sanatizedDialogue]);
            });
        });
    });
    
    describe('POST /api/dialogue', () => {
        const newDialogue = dialogue[0];

        context('Given that there is no auth header', () => {
            it('responds with 401 and an error message', () => {
                return supertest(app)
                    .post('/api/dialogue')
                    .send(newDialogue)
                    .expect(401, {
                        error: 'Missing bearer token',
                    });
            });
        });

        context('Given that there is an auth header', () => {
            context('Given that the user does not have admin privileges', () => {
                before('seed users', () => helpers.seedUsers(db, testUsers));
                before('seed stories', () => helpers.seedStories(db, stories));
                it('returns 401 and an error message', () => {
                    return supertest(app)
                        .post('/api/dialogue')
                        .set('Authorization', helpers.makeAuthHeader(nonAdminUser))
                        .send(newDialogue)
                        .expect(401, {
                            error: 'This account does not have admin privileges',
                        });
                });
            });

            context('Given that the user does have admin privileges', () => {
                beforeEach('seed users', () => helpers.seedUsers(db, testUsers));
                beforeEach('seed stories', () => helpers.seedStories(db, stories));

                const requiredFields = [
                    'chapter_number',
                    'page',
                    'text',
                    'image_url',
                    'image_alt_text',
                    'choices',
                    'responses_to_choices',
                    'background_image_url',
                    'background_image_alt_text',
                ];

                requiredFields.forEach(field => {
                    const postAttempt = { ...newDialogue };
                    delete postAttempt[field];

                    it(`responds with 400 and an error message when '${field}' is missing`, () => {
                        return supertest(app)
                            .post('/api/dialogue')
                            .set('Authorization', helpers.makeAuthHeader(adminUser))
                            .send(postAttempt)
                            .expect(400, {
                                error: `Missing '${field}' in request body`,
                            });
                    });
                });

                context('Given that the request body is complete', () => {
                    it('responds with 201 and creates a new dialogue', () => {
                        return supertest(app)
                            .post('/api/dialogue')
                            .set('Authorization', helpers.makeAuthHeader(adminUser))
                            .send(newDialogue)
                            .expect(201)
                            .expect(res => {
                                expect(res.headers.location).to.eql(`/api/dialogue/${res.body.id}`);
                                expect(res.body).to.have.property('id');
                                expect(res.body.chapter_number).to.eql(newDialogue.chapter_number);
                                expect(res.body.page).to.eql(newDialogue.page);
                                expect(res.body.text).to.eql(newDialogue.text);
                                expect(res.body.image_url).to.eql(newDialogue.image_url);
                                expect(res.body.image_alt_text).to.eql(newDialogue.image_alt_text);
                                expect(res.body.choices).to.eql(newDialogue.choices);
                                expect(res.body.responses_to_choices).to.eql(newDialogue.responses_to_choices);
                                expect(res.body.background_image_url).to.eql(newDialogue.background_image_url);
                                expect(res.body.background_image_alt_text).to.eql(newDialogue.background_image_alt_text);
                            })
                            .then(postRes => 
                                supertest(app)
                                    .get(`/api/dialogue/${postRes.body.id}`)
                                    .expect(res => {
                                        expect(res.body.chapter_number).to.eql(newDialogue.chapter_number);
                                        expect(res.body.page).to.eql(newDialogue.page);
                                        expect(res.body.text).to.eql(newDialogue.text);
                                        expect(res.body.image_url).to.eql(newDialogue.image_url);
                                        expect(res.body.image_alt_text).to.eql(newDialogue.image_alt_text);
                                        expect(res.body.choices).to.eql(newDialogue.choices);
                                        expect(res.body.responses_to_choices).to.eql(newDialogue.responses_to_choices);
                                        expect(res.body.background_image_url).to.eql(newDialogue.background_image_url);
                                        expect(res.body.background_image_alt_text).to.eql(newDialogue.background_image_alt_text);
                                    })
                            );
                    });
                });
            });
        });
    });

    describe('GET /api/dialogue/by-chapter/:chapter_number', () => {
        context('Given that the chapter with chapter_number does not exist', () => {
            return supertest(app)
                .get('/api/dialogue/by-chapter/1')
                .expect(404, {
                    error: { message: `Chapter doesn't exist` },
                });
        });

        context('Given that the chapter does exist', () => {
            context('Given that there is no dialogue', () => {
                before('seed stories', () => helpers.seedStories(db, stories));
                it('responds with 200 and an empty pages array', () => {
                    const chapter = stories[0];
                    const expectedReponse = helpers.makeStoryDialogue(chapter);
                    return supertest(app)
                        .get(`/api/dialogue/by-chapter/${chapter.chapter_number}`)
                        .expect(200, expectedReponse);
                });
            });

            context('given there is dialogue', () => {
                before('seed dialogue', () => 
                    helpers.seedDialogue(db, testUsers, stories, dialogue)
                );
                it('responds with 200 and dialogue by chapter number', () => {
                    const chapter = stories[0];
                    const expectedDialogue = dialogue.filter(d => d.chapter_number === chapter.chapter_number);
                    const expectedReponse = helpers.makeStoryDialogue(chapter, expectedDialogue);
                    return supertest(app)
                        .get(`/api/dialogue/by-chapter/${chapter.chapter_number}`)
                        .expect(200, expectedReponse);
                });
            });
        });
    });
});
