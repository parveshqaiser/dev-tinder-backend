const {UserDetails}= require("../model/user");

let jwt = require("jsonwebtoken");

const userAuthentication = async (req,res, next)=>{

    try {
        let getCookie = req.cookies?.token;

        console.log("getCookie **", getCookie)
        if(!getCookie)
        {
            res.status(401).json({message: "Unauthorized user"});
            return;
        }
    
        let verifyToken = jwt.verify(getCookie, "secret-key"); // we get verified token of user id or mongodb id 
    
        let user = await UserDetails.findById(verifyToken.id);
    
        if(!user){
            res.status(400).json({message: "Invalid User"});
            return;
        }
        
        req.user = user;
        next(); // here next is called to move to the request handler
    } catch (error) {
        console.log(error);
        res.send(" " + error.message);
    }
}

module.exports = {userAuthentication};