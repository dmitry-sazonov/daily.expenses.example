var log = require("libs/log")(module);

var User = require("mongo").User;

// POST /signIn
function signIn(req, res) {

    var user = {
        username: req.body.username,
        password: req.body.password
    };

    User.getByUsernameAndPassword(user, function(err, user) {

        if (err) return res.send(500, err);

        var resp = {
            username: user.username,
            email: user.email
        };

        req.session.user_id = user._id.toString();
        req.session.login = user.username;
        res.send(resp);

    });

}

// POST /signUp
function signUp(req, res) {

    var user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    };

    User.save(user, function(err) {

        if (err) return res.send(500, err);
        
        res.send(200);
        
    });

}

//POST /signOut
function signOut(req, res) {

    req.session.destroy();
    res.send(200);

}

exports.signIn = signIn;
exports.signUp = signUp;
exports.signOut = signOut;