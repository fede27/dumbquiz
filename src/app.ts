import * as constants from './globalConstants';
import * as Promise from 'bluebird';
import * as Config from 'config';
import * as Passport from 'passport';
import * as Express from 'express';
import * as Session from 'express-session';
import * as Quip from 'quip';
import * as Path from 'path';
import * as Winston from 'winston';


// API controllers
import { UserAPI } from './api/userAPI';
import { QuizAPI } from './api/quizAPI';
import { HomeAPI } from './api/homeAPI';
import { AdminAPI } from './api/adminAPI';


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
    secret: Config.get<string>("session.secret"),
}));

// public resources
app.use(Express.static('public'));

// setup view engine
app.set("views", Path.join(__dirname, "./views"));
app.set("view engine", "pug");

// setup auth middleware
import'./auth/authStrategy';

app.use(Passport.initialize());
app.use(Passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

// setup routes
const homeAPI = new HomeAPI();
app.use('/', homeAPI.router);

const userAPI = new UserAPI();
app.use('/', userAPI.router);

const adminAPI = new AdminAPI();
app.use('/admin', adminAPI.router);

const quizAPI = new QuizAPI();
app.use('/api', quizAPI.router);


app.use((request, response, next) => {
    Winston.warn(`[${ constants.APP_NAME }] Resource not found: ${request.url}`);
    Quip(response).notFound().json({ error: 'not found', status: 404 });
});

app.use((error, request, response, next) => {
    Winston.error(`[${ constants.APP_NAME }] Internal server error: ${request.url} - ${error.message}`);
    Quip(response).error().json({ error: 'internal server error', status: 500, message: error.message });
});

export default app;