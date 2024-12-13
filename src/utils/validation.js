
const validator = require("validator");

const userValidation = (req)=>{

    let {fullName,email,gender, password, age,skills, languages} = req.body;

    if(!fullName || (fullName && fullName.trim()== "")){
        throw new Error("Name required");
    }

    if(fullName && fullName.length <4){
        throw new Error("Provide full name");
    }

    if(!validator.isEmail(email)){
        throw new Error("Invalid Email")
    }

    if(!password || (password && password.trim()== "")){
        throw new Error("Password required");
    }

    if(!["Male","Female","Others"].includes(gender)){
        throw new Error("Invalid Gender")
    }

    if(!age){
        throw new Error("Age Required")
    }

    if(skills && skills.length >=6){
        throw new Error("Max 5 Interest allowed")
    }

    if(languages && languages.length >=4){
        throw new Error("Max 3 Languages allowed")
    }
}

module.exports = {userValidation};