

const express = require("express");
const { userAuthentication } = require("../middleware/authentication");
const { RequestDetails } = require("../model/request");
const {UserDetails} = require("../model/user");

const router = express.Router();

// all the request received that are pending
router.get("/users/request/pending", userAuthentication, async(req,res)=>{

    try {
        let loggedInUser = req?.user?._id;

        let allPendingRequest = await RequestDetails.find({status: "Interest", toUserId : loggedInUser})
        .populate("fromUserId", "fullName age bio gender photoUrl");

        if(allPendingRequest.length ==0){
            return res.status(200).json({ 
                message: "No pending requests found", 
                success: true, 
                allPendingRequest: [] 
            });
        }

        res.status(200).json({allPendingRequest, success : true});
        
    } catch (error) {
        console.log("error getting all request ", error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});

// all connections after accepting request
router.get("/users/connection/all", userAuthentication,async(req,res)=>{

    try {
        let loggedInUser = req?.user?._id;

        let allConnections = await RequestDetails.find({
            $or :[
                {toUserId :loggedInUser , status : "Accept"},
                {fromUserId : loggedInUser ,status : "Accept"},
            ]
        }).populate("fromUserId", "fullName age gender skills bio languages photoUrl")
        .populate("toUserId","fullName age gender skills bio languages photoUrl");

        if(allConnections.length ==0){
            return res.status(200).json({ 
                message: "No connection found", 
                success: true, 
                allPendingRequest: [] 
            });
        }

        // all connections will give data of all users including current user data.
        // because of this, loggedIn user in == fromUser then show all toUserId else, fromUserId

        let data = allConnections.length && allConnections.map((val)=>{
            if(val.fromUserId._id.toString() == loggedInUser.toString()){
                return val.toUserId;
            }
            return val.fromUserId;
        });


        if(data.length == 0){
            res.status(404).json({message: "No Connections found"});
            return;
        }

        res.status(200).json({data , success : true});

    } catch (error) {
        console.log("error getting all request ", error);
        res.status(400).send("error " + error.message);
    }
});

// home page feed
router.get("/users/feed", userAuthentication, async(req,res)=>{

    try {
        let loggedInUser = req?.user?._id;

        let page = req.query.page || 1;
        let limit = req.query.limit || 10;

        let skip = (page -1) * limit;
        limit = limit> 20 ? 20 : limit;
        

        let allMutualConnections = await RequestDetails.find({
            $or : [
                {fromUserId : loggedInUser},
                {toUserId : loggedInUser}
            ]
        }).select("fromUserId toUserId");

        let hideUserIds = new Set();

        allMutualConnections.forEach((val)=>{
            hideUserIds.add(val.fromUserId.toString());
            hideUserIds.add(val.toUserId.toString());
        });

        //let isArray = Array.from(hideUserIds); // to convert into array of strings ["","",""]

        // let allUsers = await UserDetails.find({}).select("fullName age gender bio skills photoUrl")

        //let allFeedUsers = allUsers.filter(val => !isArray.includes(val._id.toString()) && loggedInUser.toString() !== val._id.toString());

        let allFeedUsers = await UserDetails.find({
            $and : [
                {_id: {$nin : Array.from(hideUserIds)}},
                {_id :{$ne : loggedInUser}}
            ]
        }).select("fullName age email gender bio skills languages photoUrl").skip(skip).limit(limit);

        if(allFeedUsers.length ==0){
            return res.status(404).json({message : "Users Not found" , success : false});
        }

        res.status(200).json({data :allFeedUsers , success: true})

    } catch (error) {
        console.log("error getting all feeds ", error);
        res.status(400).send("error " + error.message);
    }
})

// testing purpose
router.get("/test/users/feed",userAuthentication, async(req,res)=>{

    try {
        let loggedInUser = req?.user?._id;

        let allConnections = await RequestDetails.find({fromUserId : loggedInUser }, {toUserId : loggedInUser}).select("fromUserId toUserId");
        // let allConnections = await RequestDetails.find({
        //     $or : [
        //         {fromUserId : loggedInUser},
        //         {toUserId : loggedInUser}
        //     ]
        // });

        let hideDuplicateUserIds = new Set();

        allConnections.forEach(req=>{
            hideDuplicateUserIds.add(req.fromUserId.toString());
            hideDuplicateUserIds.add(req.toUserId.toString());
        });

        let convertToArray = Array.from(hideDuplicateUserIds);
        // let convertToArray =[];
        // convertToArray.push(hideDuplicateUserIds); comes with setID , better to use Array.from() method
        console.log(convertToArray);

        let filter = await UserDetails.find({
            $and : [
                {_id : {$nin : convertToArray}},
                {_id : {$ne : loggedInUser}}
            ]
        }).select("fullName age bio")

        // let allUsers = await UserDetails.find({}).select("fullName age bio");

        // let filterAllUsers = allUsers.filter(val => !convertToArray.includes(val._id.toString()));

        res.status(200).json({filter, message:"ALl Feeds"})
        
    } catch (error) {
        console.log(" ************ error ", error);
    }
})

module.exports = router;