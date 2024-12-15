
let mongoose = require("mongoose");

let messageSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.SchemaTypes.ObjectId,
        required : true,
        ref : "users"
    },
    toUserId : {
        type : mongoose.SchemaTypes.ObjectId,
        required : true,
        ref : "users"
    },
    message : {
        type : String,
    }
}, {timestamps : true});


let messageDetails = mongoose.model("message", messageSchema);

module.exports = {messageDetails};