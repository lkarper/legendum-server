require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const dialogueRouter = require('./dialogue/dialogue-router');
const exercisesRouter = require('./exercises/exercises-router');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'dev';
app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/api/dialogue', dialogueRouter);
app.use('/api/exercises', exercisesRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } };
    } else {
        console.error(error);
        response = { message: error.message, error };
    }
    res.status(500).json(response);
});

module.exports = app;