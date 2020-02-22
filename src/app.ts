import * as constants from './globalConstants';
import * as Promise from 'bluebird';
import * as Passport from 'passport';
import * as Express from 'express';
import * as Session from 'express-session';
import * as Quip from 'quip';
import * as Path from 'path';
import * as Winston from 'Winston';


// API controllers
import { UserAPI } from './api/userAPI';
import { QuizAPI } from './api/quizAPI';


const app = Express();

app.disable('etag');
app.use(Express.json({ limit: '50mb' }));

app.use(Express.urlencoded({
    extended: true,
    parameterLimit: 10000,
    limit: '50mb',
}));

app.use(Session({
    resave: false,
    saveUninitialized: true,
    secret: 'cosa-da-non-fare-in-un-vero-applicativo',
}));

app.use('/static', Express.static(Path.resolve('./site/static')), (request, response, next) => {
    response.sendStatus(404);
});

// setup auth middleware
import * as authStrategy from './auth/authStrategy';

app.use(Passport.initialize());
app.use(Passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// setup routes

const quizAPI = new QuizAPI();
app.use('/api', quizAPI.router);

const userAPI = new UserAPI();
app.use('/user', userAPI.router);

app.use((request, response, next) => {
    Winston.warn(`[${ constants.APP_NAME }] Resource not found: ${request.url}`);
    Quip(response).notFound().json({ error: 'not found', status: 404 });
});

app.use((error, request, response, next) => {
    Winston.error(`[${ constants.APP_NAME }] Internal server error: ${request.url} - ${error.message}`);
    Quip(response).error().json({ error: 'internal server error', status: 500, message: error.message });
});

export default app;