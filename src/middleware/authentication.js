
const {UserDetails}= require("../model/user");

let jwt = require("jsonwebtoken");

const userAuthentication = async (req,res, next)=>{

    try {

        let getCookie = req.cookies?.token || req.header("Authorization")?.replace("Bearer","");

        if(!getCookie){
            return res.status(401).json({
                message : "Unauthorized User", 
                success : false, 
                status : 401
            });
        }
    
        let verifyToken = jwt.verify(getCookie, process.env.JWT_SECRET_KEY); // we get verified token of user id or mongodb id 
    
        let user = await UserDetails.findById(verifyToken.id); // not required
    
        if(!user){
            return res.status(404).json({
                message: "Invalid User", 
                success:false
            });
        }
        
        req.user = user;
        next(); // here next is called to move to the request handler
    } catch (error) {
        res.status(401).json({
            message : "Error in Authentication", 
            success: false , 
            status : 401
        });
    }
}

module.exports = {userAuthentication};