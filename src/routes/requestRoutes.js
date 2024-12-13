

const express = require("express");
const { userAuthentication } = require("../middleware/authentication");
const { UserDetails } = require("../model/user");
const {RequestDetails} = require("../model/request");
const router = express.Router();


// ignore or interest
router.post("/request/:status/:id", userAuthentication, async(req,res)=>{

    try {
        let fromUserId = req?.user?._id;
        let toUserId = req.params.id;
        let status = req.params.status;

        if(fromUserId == toUserId){
            throw new Error("Invalid Request");
        }

        let allowedRequest = ["Ignore","Interest"];

        if(!allowedRequest.includes(status)){
            throw new Error("Invalid Status");
        }

        let userExist = await UserDetails.findById(toUserId); // to check if that user actually exist in user collection. while checking from postman, we can send fake _id, this is the reason we are checking if that user exist or not;

        if(!userExist){
            throw new Error("Invalid User")
        }

        // A => B || B => A
        // two condition it checks, first (sender & receiver) (parvesh to elon) id present or not, second (elon becomes fromId & parvesh becomes toID) present or not.
        let isConnectionAlreadySent = await RequestDetails.findOne({
            $or :[
                {fromUserId,toUserId},
                {fromUserId : toUserId , toUserId:fromUserId}
            ]
        });

        if(isConnectionAlreadySent){
            return res.status(400).json({message : "Request Already Sent", success : false})
        }

        let connRequest = new RequestDetails({
            fromUserId,
            toUserId,
            status,
        });

        await connRequest.save();

        res.status(200).json({message: `Status ${connRequest.status}ed`, success: true});
        
    } catch (error) {
        console.log("error sending request ", error);
        res.status(400).send("error " + error.message);
    }
});


// accept or reject
router.post("/request/review/:status/:id",userAuthentication, async(req,res)=>{

    try {
        let status = req.params.status;
        let requestId = req.params.id; // from front end we are passing the _id of the request 

        let loggedInUser = req?.user?._id;

        let allowedRequest = ["Accept","Reject"];

        if(!allowedRequest.includes(status)){
            return res.status(400).json({message: "Invalid Status"});
        }

        let isConnectionRequestValid = await RequestDetails.findOne({status : "Interest", toUserId : loggedInUser , _id:requestId });  //matching the _id, if _id is actually present or not
       

        if(!isConnectionRequestValid){
            return res.status(400).json({message: "Invalid Request"});
        }

       isConnectionRequestValid.status = status;

       let updatedData = await isConnectionRequestValid.save();
       res.status(200).json({message: `Request ${updatedData.status}ed`, success: true});

    } catch (error) {
        console.log("error sending request ", error);
        res.status(400).send("error " + error.message);
    }
});



module.exports = router;