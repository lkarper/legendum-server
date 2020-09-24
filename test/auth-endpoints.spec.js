const knex = require('knex');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Auth endpoints', () => {
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

    after('disconnect from db', () => db.destroy());

    before('cleanup', () => helpers.cleanTables(db));

    afterEach('cleanup', () => helpers.cleanTables(db));

    describe('POST /api/auth/login', () => {
        beforeEach('insert users', () => 
            helpers.seedUsers(
                db,
                testUsers
            )
        );

        const requiredFields = ['user_name', 'password'];

        requiredFields.forEach(field => {
            const loginAttempt = {
                user_name: testUser.user_name,
                password: testUser.password,
            };

            it(`responds with 400 error when ${field} is missing`, () => {
                delete loginAttempt[field];

                return supertest(app)
                    .post('/api/auth/login')
                    .send(loginAttempt)
                    .expect(400, {
                        error: `Missing '${field}' in request body`,
                    });
            });
        });
        
        it('responds 400 error when bad user_name', () => {
            const badUsername = {
                user_name: 'not_a_real_user_name',
                password: testUser.password,
            };
            
            return supertest(app)
                .post('/api/auth/login')
                .send(badUsername)
                .expect(400, {
                    error: `Incorrect user_name or password`,
                });
        });

        it('responds 400 error when bad password', () => {
            const badPassword = {
                user_name: testUser.user_name,
                password: 'not_a_real_password',
            };

            return supertest(app)
                .post('/api/auth/login')
                .send(badPassword)
                .expect(400, {
                    error: `Incorrect user_name or password`,
                });
        });

        it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
            const validCredentials = {
                user_name: testUser.user_name,
                password: testUser.password,
            };

            const expectedToken = jwt.sign(
                { user_id: testUser.id },
                process.env.JWT_SECRET,
                {
                    subject: testUser.user_name,
                    expiresIn: process.env.JWT_EXPIRY,
                    algorithm: 'HS256',
                }
            );

            return supertest(app)
                .post('/api/auth/login')
                .send(validCredentials)
                .expect(200, {
                    authToken: expectedToken,
                });
        });
    });

    describe('POST /api/auth/refresh', () => {
        beforeEach('insert users', () =>
            helpers.seedUsers(
                db,
                testUsers
            )
        );

        context('given that there is no auth header', () => {
            it(`responds with 401 'Missing bearer token'`, () => {
                return supertest(app)
                    .post('/api/auth/refresh')
                    .expect(401, { error: 'Missing bearer token' });
            });
        });

        context('given that there is a valid auth header', () => {
            it('responds 200 and JWT auth token using secret', () => {
                const expectedToken = jwt.sign(
                    { user_id: testUser.id },
                    process.env.JWT_SECRET,
                    {
                        subject: testUser.user_name,
                        expiresIn: process.env.JWT_EXPIRY,
                        algorithm: 'HS256',
                    }
                );
                
                return supertest(app)
                    .post('/api/auth/refresh')
                    .set('Authorization', helpers.makeAuthHeader(testUser))
                    .expect(200, {
                        authToken: expectedToken,
                    });
            });
        });
    });
});
