const mongoose = require("mongoose");


const connectionRequestSchema = new mongoose.Schema({
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
    status : {
        type : String,
        enum : {
            type : String,
            values : ["Ignore","Interest","Accept","Reject"],
            message: `{VALUES} is incorrect type`
        }
    }
},{timestamps:true});

// connectionRequestSchema.index({fromUserId :1, toUserId :1}) this one is for optimization DB. 

// connectionRequestSchema.pre("save", function(next){
//     let currentUser = this;
//     // to check if curr user is same as to user

//     if(currentUser.fromUserId.equals(currentUser.toUserId)){
//         throw new Error("Can't send request to yourself");
//     }
//     next();    
// });

const RequestDetails = mongoose.model("requests", connectionRequestSchema);

module.exports = {RequestDetails};