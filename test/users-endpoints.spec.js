const knex = require('knex');
const bcrypt = require('bcryptjs');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');

describe('Users endpoints', () => {
    let db;

    const { testUsers } = helpers.makeUsersFixtures();
    const testUser = testUsers[0];

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        });
        app.set('db', db);
    });

    after('disconnet from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    describe('POST /api/users', () => {
        context('User Validation', () => {
            beforeEach('insert users', () => 
                helpers.seedUsers(db, testUsers)
            );

            const requiredFields = [
                'user_name',
                'password',
                'display_name',
            ];

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    user_name: 'test username',
                    password: 'test_password',
                    display_name: 'marcustestus'
                };

                it(`responds with 400 require error when ${field} is missing`, () => {
                    delete registerAttemptBody[field];

                    return supertest(app)
                        .post('/api/users')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`,
                        });
                });
            });

            it(`responds with 400 'Password must be at least 8 characters in length' when password too short`, () => {
                const userShortPassword = {
                    user_name: 'test username',
                    password: 'test',
                    display_name: 'marcustestus'
                };
                
                return supertest(app)
                    .post('/api/users')
                    .send(userShortPassword)
                    .expect(400, {
                        error: 'Password must be at least 8 characters in length',
                    });
            });

            it(`responds with 400 'Password must be no more than 72 characters in length' when password is too long`, () => {
                const userLongPassword = {
                    user_name: 'test username',
                    password: '*'.repeat(73),
                    display_name: 'marcustestus'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(userLongPassword)
                    .expect(400, {
                        error: 'Password must be no more than 72 characters in length',
                    });
            });

            it(`responds 400 error when password starts with spaces`, () => {
                const userPasswordStartsSpaces = {
                    user_name: 'test username',
                    password: ' passwordlongbutspaces',
                    display_name: 'marcustestus'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordStartsSpaces)
                    .expect(400, {
                        error: 'Password must not start or end with empty spaces',
                    });
            });

            it(`responds 400 error when password ends with spaces`, () => {
                const userPasswordEndsSpaces = {
                    user_name: 'test username',
                    password: 'passwordlongbutspaces ',
                    display_name: 'marcustestus'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordEndsSpaces)
                    .expect(400, {
                        error: `Password must not start or end with empty spaces`,
                    });
            });

            it(`responds 400 error when password isn't complex enough`, () => {
                const userPasswordNotComplex = {
                    user_name: 'test username',
                    password: 'passwordlongbutsimple123',
                    display_name: 'marcustestus'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(userPasswordNotComplex)
                    .expect(400, {
                        error: `Password must contain 1 upper case letter, lower case letter, number and special character`,
                    });
            });

            it(`responds 400 'Username already taken' when username isn't unique`, () => {
                const duplciateUsername = {
                    user_name: testUser.user_name,
                    password: 'passwordG00d!',
                    display_name: 'marcustestus'
                };

                return supertest(app)
                    .post('/api/users')
                    .send(duplciateUsername)
                    .expect(400, {
                        error: 'Username already taken',
                    });
            });
        });

        context.only(`Given a valid request body`, () => {
            it(`responds 201, serialized user, storing bcrypted password`, function() {
                this.retries(3);
                const newUser = {
                    user_name: 'test username',
                    password: '11AAaa!!',
                    display_name: 'marcus_testus',
                };

                return supertest(app)
                    .post('/api/users')
                    .send(newUser)
                    .expect(201)
                    .expect(res => {
                        expect(res.body).to.have.property('id');
                        expect(res.body.user_name).to.eql(newUser.user_name);
                        expect(res.body.display_name).to.eql(newUser.display_name);
                        const expectedDate = new Date().toLocaleString();
                        const actualDate = new Date(res.body.date_created).toLocaleString();
                        expect(actualDate).to.eql(expectedDate);
                        expect(res.body).to.not.have.property('password');
                        expect(res.headers.location).to.eql(`/api/users/${res.body.id}`);
                    })
                    .expect(res =>
                        db
                            .from('legendum_users')
                            .select('*')
                            .where({ id: res.body.id })
                            .first()
                            .then(row => {
                                expect(row.user_name).to.eql(newUser.user_name);
                                expect(row.display_name).to.eql(newUser.display_name);
                                const expectedDate = new Date().toLocaleString();
                                const actualDate = new Date(row.date_created).toLocaleString();
                                expect(actualDate).to.eql(expectedDate);
                                return bcrypt.compare(newUser.password, row.password);
                            })
                            .then(compareMatch => expect(compareMatch).to.be.true)
                    );
            });
        });
    });
});
