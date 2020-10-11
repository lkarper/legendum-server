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
});
