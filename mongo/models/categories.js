var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var categoriesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    parent_id: {
        type: Schema.Types.ObjectId
    },
    plans: {
        type: Schema.Types.Mixed
    }
});

module.exports = mongoose.model("Categories", categoriesSchema);
