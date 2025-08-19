
const mongoose = require("mongoose");

const databaseConnection = async()=>{
    await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
}

module.exports= {databaseConnection};


