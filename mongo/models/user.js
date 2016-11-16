var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    }
});

userSchema.virtual("setPassword")
    .set(function(password) {
        var md5 = require('crypto').createHash('md5');
        this.password = md5.update(password).digest('hex');
    });
    //.get(function() { return this._password; });

module.exports = mongoose.model("User", userSchema);
