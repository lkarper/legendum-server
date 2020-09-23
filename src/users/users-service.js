const xss = require('xss');
const bcrypt = require('bcryptjs');

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    validatePassword(password) {
        if (password.length < 8) {
            return `Password must be at least 8 characters in length`;
        }
        if (password.length > 72) {
            return `Password must be no more than 72 characters in length`;
        }
        if (password.startsWith(' ') || password.endsWith(' ')) {
            return 'Password must not start or end with empty spaces';
        }
        if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password must contain 1 upper case letter, lower case letter, number and special character';
        }
        return null;
    },
    hasUserWithUserName(db, user_name) {
        return db('legendum_users')
            .where({ user_name })
            .first()
            .then(user => !!user);
    },
    insertUser(db, newUser) {
        return db
            .insert(newUser)
            .into('legendum_users')
            .returning('*')
            .then(([user]) => user);
    },
    serializeUser(user) {
        return {
            id: user.id,
            user_name: xss(user.user_name),
            display_name: xss(user.display_name),
            date_created: new Date(user.date_created),
        };
    },
    hashPassword(password) {
        return bcrypt.hash(password, 12);
    },
};

module.exports = UsersService;
