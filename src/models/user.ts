
import * as BCrypt from 'bcrypt-nodejs';
import * as Mongoose from 'mongoose';

type comparePasswordFn = (candidatePassword: string, cb: (err: any, isMatch: boolean) => void) => void;

export type UserDocument = Mongoose.Document & {
    email: string;
    password: string;
    admin: boolean;
    
    comparePassword: comparePasswordFn;
};


const userSchema = new Mongoose.Schema({
    email: { type: String, unique: true },
    password: String,
    admin: Boolean,
}, { timestamps: true });

userSchema.pre("save", function(next) {
    const user = this as UserDocument;
    if (!user.isModified('password')) {
        return next();
    }

    BCrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }

        BCrypt.hash(user.password, salt, undefined, (err: Mongoose.Error, hash) => {
            if (err) {
                return next(err);
            }

            user.password = hash;
            next();
        });
    });
});

const comparePassword: comparePasswordFn = function(candidatePassword, cb) {
    BCrypt.compare(candidatePassword, this.password, (err: Mongoose.Error, isMatch: boolean) => {
        cb(err, isMatch);
    });
}

userSchema.methods.comparePassword = comparePassword;

export const User = Mongoose.model<UserDocument>("User", userSchema);