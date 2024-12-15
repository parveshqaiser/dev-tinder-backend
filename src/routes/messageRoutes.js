
const express = require("express");
const router = express.Router();
const { userAuthentication} = require("../middleware/authentication");
const { UserDetails } = require("../model/user");
const {conversationDetails } = require("../model/conversation");
const { messageDetails } = require("../model/message");

router.post("/send/message/:id", userAuthentication, async(req, res)=>{

    try {
        
        let fromUserId = req?.user?._id;  // logged in user or sender
        let toUserId = req.params.id;  // receiver

        let {message} = req.body;

        let isUserExist = await UserDetails.findById(toUserId);

        if(!isUserExist){
            return res.status(404).json({message : "User Doesn't exist", success : false});
        }

        // here need to add validation that message can be sent only to friends & not all users


        let getConversation = await conversationDetails.findOne({partners : {$all : [fromUserId, toUserId]}});

        // only for first time we check if "from" & "to " are present in DB or not 
        // for first time it will give null, if null , we have to create or add. As soon as we create we get messages key

        if(!getConversation){
            getConversation =  await conversationDetails.create({partners : [fromUserId , toUserId]})
        }

        let addMessage = await messageDetails.create({
            fromUserId,
            toUserId,
            message
        });

        if(addMessage && getConversation){
            getConversation.messages.push(addMessage?._id);
        }

        await getConversation.save();

        res.status(200).json({message : "Message Sent", success : true})

        // use of socket io

    } catch (error) {
        console.log("error in sending msg ", error)
    }
});


// get all conversation between two users

router.get("/get/messages/:id", userAuthentication, async(req, res)=>{

    try {
        let fromUserId = req?.user?._id;  // logged in user or sender
        let toUserId = req.params.id;  // receiver

        let getAllMessages = await conversationDetails.findOne({partners : {$all : [fromUserId ,toUserId]}}).populate("messages");

        if(getAllMessages == null){
            return res.status(200).json({message : "No Conversation", getAllMessages : []})
        }

        res.status(200).json({getAllMessages})
        
    } catch (error) {
        console.log("err in receiving msg ", error);
    }


})


module.exports = router;
