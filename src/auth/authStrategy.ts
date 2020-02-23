import * as constants from '../globalConstants';
import { Request, Response, NextFunction } from 'express';
import * as Passport from 'passport';
import * as PassportLocal from 'passport-local';
import * as _ from 'lodash';
import * as Winston from 'Winston';

import { User, UserDocument} from '../models/user';

const LocalStrategy = PassportLocal.Strategy;

// Serialize and deserialize user into session
Passport.serializeUser<any, any>((user, done) => {
    done(undefined, user.id);
});

Passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

// Login stategy with email and password
Passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email.toLowerCase() }, (err, user: UserDocument) => {
        if (err) {
            return done(err);
        }

        if (!user) {
            return done(undefined, false, { message: `User ${ email } not found`});
        }

        user.comparePassword(password, (err, isMatch: boolean) => {
            if (err) {
                return done(err);
            }
            if (isMatch) {
                return done(undefined, user);
            }
            return done(undefined, false, { message: 'Invalid email or password'});
        });
    });
}));

// Per questo esempio elementare autenticazione e autorizzazione coincidono, quindi basta solo il controllo di autenticazione
export const isAuthenticated = (request: Request, response: Response, next: NextFunction) => {
    if (request.isAuthenticated()) {
        return next();
    }
    Winston.warn(`[${ constants.APP_NAME }] Unauthorized access to url ${request.url} blocked`);
    response.redirect('/');
}