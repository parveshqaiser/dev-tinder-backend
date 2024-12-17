
const express = require("express");
const {UserDetails}= require("../model/user");
const {userValidation}= require("../utils/validation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { userAuthentication} = require("../middleware/authentication");
const router = express.Router();
const validator = require("validator");

router.post("/signup", async(req,res)=>{
 
    try {
        userValidation(req);

        let {fullName , email, password, gender, age, bio,skills, languages, photoUrl} = req.body;

        let hashPassword = await bcrypt.hash(password,10);

        let isUserExist = await UserDetails.findOne({email});

        if(isUserExist){
            return res.status(400).json({message : "Email Already Exist", success : false});
        }

        // let user = new UserDetails(req.body);
        // creating a new instance of the user model
        let user = await new UserDetails({
            fullName, 
            email, 
            password :hashPassword,
            gender,
            age,
            skills,
            languages,
            bio,
            photoUrl
        });

        await user.save();
        res.status(201).json({message:"Account Created Successfully", success: true});
    } catch (error) {
        console.log("failed to create user", error);
        res.status(400).send("error " + error.message);
    }
});

router.post("/login", async(req,res)=>{
    let {email,password} = req.body;
    try {

        if(!validator.isEmail(email))
        {
            res.status(400).json({message: "Email Required"});
            return;
        }

        if(!password || (password && password.trim()== "")){
            res.status(400).json({message: "Password Required"});
            return;
        }
        let userData = await UserDetails.findOne({email});

        if(!userData){
            res.status(400).json({message: "Invalid Credentials"});
            return;
        }

        let matchPassword = await bcrypt.compare(password,userData.password);
        let token = jwt.sign({id : userData._id },"secret-key",{expiresIn :"1d"});

        if(!matchPassword){
            res.status(400).json({message: "Invalid Credentials"});
            return;
        } else{
            res.cookie("token",token);
            res.status(201).json({message:"Hey "+ userData.fullName + ", Login Success", success: true , token});
        }

    } catch (error) {
        console.log("failed to login ", error);
        res.status(400).send(error.message);
    }
});

router.post("/logout", (req,res)=>{

    try {
        res.cookie("token", "", {expires: new Date(Date.now())}).json({message :"Logout Success", success : true})

        // return res.status(200).cookie("token", "", {maxAge:0}).json({message :"Logout Success", success : true})
    } catch (error) {
        console.log("error logging out ", error);
        res.status(400).send("error " + error.message);
    }
});

//  forgetting password , validate mail
router.post("/check/email",async(req,res)=>{

    try {
        let {email} = req.body;

        let isEmailExist = await UserDetails.findOne({email});
        
        if(!isEmailExist)
        {
            return res.status(404).json({message : "Invalid Email", success : false})
        }

        res.status(200).json({message : "email valid ", success : true});
    } catch (error) {
        console.log("err in forgetting pass ", error)
    }
});

router.post("/forgot/password", async(req, res)=>{

    try {
        let {confirmPassword, newPassword, email} = req.body;

        if(!newPassword || (newPassword && newPassword.trim()== ""))
        {
            return res.status(400).json({message : "Password Required", success : false})
        }

        let user = await UserDetails.findOne({email});

        let hashPassword = await bcrypt.hash(newPassword,10);

        user.password = hashPassword;
        await user.save();

        return res.status(200).json({message : "Password Changed", success : true})

    } catch (error) {
        res.status(400).send("error " + error.message);
    }
})

module.exports = router;