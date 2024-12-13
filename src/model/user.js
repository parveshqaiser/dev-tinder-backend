

const mongoose = require("mongoose");
const validateExpression = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullName : {
        type : String,
        required : true,
        minLength : 5,
        maxLength: 30,
    },
    email : {
        type : String,
        required : true,
        index : true, // DB optimization
        unique : true, // if we are making any field as unique, mongodb will automatically create index for that field
        trim : true,
        // validate(value) {
        //     if(!validateExpression.isEmail(value)){
        //         throw new Error("Invalid Email.", value)
        //     }
        // }
    },
    password : {
        type : String,
        required : true,
        trim : true,
    },
    newPassword : {
        type : String,
        trim : true,
        default :"",
    },
    age : {
        type : String,
        required : true,
    },   
    bio : {
        type : String,
        default : "Hey there, Looking for matches !!!"
    },   
    gender : {
        type : String,
        required : true,
        validate (value){
            if(!["Male","Female","Others"].includes(value)){
                throw new Error("Invalid Gender")
            }
        }
    },
    languages : {
        type : [String]
    },
    skills : {
        type : [String]
    },
    photoUrl : {
        type : String,
        default : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRT0M9PkaDKnCMW8NANGmmvjkS-WhhsIOe4pQ&s",
        validate (value){
            if(!validateExpression.isURL(value)){
                throw new Error("Invalid Photo URL "+ value)
            }
        }
    },
}, {timestamps:true}); 


// other way of validating user authentication is by using schema methods
// userSchema.methods.jwt_token = function(){
//     let user = this;
//     // this represents the current instance of model schema

//     let token = jwt.sign({id : user._id },"secret-key",{expiresIn :"1h"});
//     return token;
// };

const UserDetails = mongoose.model("users", userSchema);

module.exports = {UserDetails};