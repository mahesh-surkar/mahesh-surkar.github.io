var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    //console.log("id" + id);

    User.findOne({ "id": id }, function(err, user) {

        // console.log("user" + user.id + "err" + err);
        if (err) {
            return done(err, false);
        } else if (!user) {
            return done(null, false)
        } else {
            done(null, user);
        }
    });
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {

        User.findOne({ "email": email }, function(err, user) {
            //  console.log("user" + user + "err" + err);

            if (err) { return done(err); }
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }

            //console.log("password is : " + password + ":" + user.password);
            bcrypt.compare(password, user.password, function(err, res) {
                if (!res)
                    return done(null, false, {
                        message: 'Invalid Password'
                    });
                var returnUser = {
                    email: user.email,
                    createdAt: user.createdAt,
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                };
                return done(null, returnUser, {
                    message: 'Logged In Successfully'
                });
            });
        });
    }));