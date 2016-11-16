var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var recordSchema = new Schema({
    category_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    money: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    timestamp: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Record", recordSchema);
