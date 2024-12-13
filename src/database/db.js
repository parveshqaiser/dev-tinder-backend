
const mongoose = require("mongoose");

const databaseConnection = async()=>{
    await mongoose.connect("mongodb+srv://parveshqaiser:parvesh@cluster0.kv3ztw3.mongodb.net/DatingApp");
}

module.exports= {databaseConnection};


