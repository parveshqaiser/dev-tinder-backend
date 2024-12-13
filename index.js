
const express = require("express"); 
const {databaseConnection} = require("./src/database/db");
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const requestRoutes = require("./src/routes/requestRoutes");
const userHomeRoutes = require("./src/routes/userRoutes");

const parser = require("cookie-parser");
const path = require("path");
const cors = require("cors")

const app = express();
app.use(parser());
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}));

// it will work for all request
app.use(express.json()); // app.use(express.urlencoded({extended:true}));
// app.use(express.urlencoded({extended:true}));

app.use("/",authRoutes);
app.use("/",profileRoutes);
app.use("/",requestRoutes);
app.use("/",userHomeRoutes);

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

databaseConnection().then(()=>{
    console.log("DB Connected");

    app.listen(9000,()=>{
        console.log("Server is Listen at http://127.0.0.1:9000")
    });
}).catch((err)=>{
    console.log("Error connecting DB ", err);
});