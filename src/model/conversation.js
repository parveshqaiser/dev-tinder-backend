

let mongoose = require("mongoose");

let conversationModel = new mongoose.Schema({
    partners : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    }],
    messages : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "message"
    }]
}, {timestamps: true});

let conversationDetails = mongoose.model("conversation", conversationModel);

module.exports = {conversationDetails};