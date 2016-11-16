//var log = require("libs/log")(module);

// GET /checkAuth
function checkAuth(req, res, next) {

    if (req.session.user_id) {
        return next();
    }

    res.send(401);

}

exports.checkAuth = checkAuth;