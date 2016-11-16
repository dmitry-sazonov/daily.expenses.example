var config = {
    port: process.env.PORT || 3000,
    mongoUrl: "***",
    session: {
        secret: "***",
        key: "sid",
        cookie: {
            path: "/",
            httpOnly: true,
            maxAge: null
        }
    }
};

module.exports = config;