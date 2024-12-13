
const express = require("express");
const bcrypt = require("bcrypt");

const { userAuthentication} = require("../middleware/authentication");
const { UserDetails } = require("../model/user");
const {uploadFile } = require("../middleware/multer");
const { getDataUrl } = require("../utils/dataUrl");
const { cloudServer } = require("../middleware/cloudinary");
const router = express.Router();

router.get("/profile/view",userAuthentication, async(req,res, next)=>{

    try {
        let loggedInUser = req.user;

        let user = await UserDetails.findById(loggedInUser._id).select("fullName email age gender bio skills languages photoUrl");

        res.status(200).json({message: "Data Fetched Successfully", success:true , user})
    } catch (error) {
        console.log("failed to send user", error);
        res.status(400).send("error " + error.message);
    }
});

router.patch("/profile/edit",userAuthentication, uploadFile.single("file"), async(req,res, next)=>{

    try {
        let {fullName,age,gender ,bio, skills, languages} = req.body;

        let user = req.user;
        let file = req.file;
        let cloudUrl;

        // if(!skills){
        //     return res.status(400).json({message: "Please Select Your Interest", success: false})
        // }

        // if(!languages){
        //     return res.status(400).json({message: "Please Select Your Languages", success: false})
        // }

        let userSkills = skills && skills.split(",");
        let userLanguages =languages && languages.split(",");

        // if(!file){
        //     return res.status(400).json({message: "Please Upload Picture", success: false})
        // }

        if(req.file !==undefined){
            let bufferUrl = getDataUrl(file);

            try {
                cloudUrl = await cloudServer.uploader.upload(bufferUrl);
            } catch (error) {
                console.log("inner error ", error);
            }
        }

        user.fullName = fullName;
        user.age = age;
        user.gender = gender;
        user.bio = bio;
        user.skills = userSkills;
        user.languages = userLanguages;
        user.photoUrl = cloudUrl?.secure_url || user.photoUrl;

        let updatedData = await user.save();

        let data = {
            fullName: updatedData.fullName,
            email: updatedData.email,
            age: updatedData.age,
            bio: updatedData.bio,
            gender: updatedData.gender,
            languages: updatedData.languages,
            skills: updatedData.skills,
            photoUrl : updatedData.photoUrl
        }
   
        res.status(201).json({message : "Profile Updated" , data, success: true});

    } catch (error) {
        res.status(400).send("error " + error.message);
    }
});

router.patch("/profile/change/password",userAuthentication, async(req,res)=>{

    try {
        let {password , newPassword} = req.body;

        if(!password || (password && password.trim() == "")){
            return res.status(400).json({message : "Password Required"})
        }

        let user = req?.user;
        let isPasswordMatched = await bcrypt.compare(password,user.password);

        if(!isPasswordMatched){
            return res.status(400).json({message : "Incorrect Password"})
        }

        if(!newPassword || (newPassword && newPassword.trim() == "")){
            // throw new Error("New Password Required");
            return res.status(400).json({message : "New Password Required"})
        }

        let hashPassword = await bcrypt.hash(newPassword,10);

        user.password = hashPassword;
        await user.save();

        res.status(200).json({message : "Password Updated", success: true});

    } catch (error) {
        res.status(400).send("error " + error.message);
    }
});

module.exports = router;


// Object.keys(req.body).forEach(val => user[val] = req.body[val]);
// await user.save();
// const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.originalname}`;