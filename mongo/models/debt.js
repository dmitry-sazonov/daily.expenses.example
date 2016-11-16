var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var debtSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    },
    startMoney: {
        type: Number,
        required: true
    },
    comment: {
        type: String
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    payments: {
        type: Schema.Types.Mixed
    },
    done: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Debt", debtSchema);
