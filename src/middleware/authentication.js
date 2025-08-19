const {UserDetails}= require("../model/user");

let jwt = require("jsonwebtoken");

const userAuthentication = async (req,res, next)=>{

    try {
        let getCookie = req.cookies?.token; // .token here is the key
        if(!getCookie)
        {
            res.status(401).json({message: "Unauthorized user", success: false , status : 401});
            return;
        }
    
        let verifyToken = jwt.verify(getCookie, process.env.JWT_SECRET_KEY); // we get verified token of user id or mongodb id 
    
        let user = await UserDetails.findById(verifyToken.id);
    
        if(!user){
            res.status(400).json({message: "Invalid User", success:false});
            return;
        }
        
        req.user = user;
        next(); // here next is called to move to the request handler
    } catch (error) {
      console.log("error in authentication", error.message);
        res.status(401).json({message : "Error in Authentication", success: false , status : 401});
    }
}

module.exports = {userAuthentication};