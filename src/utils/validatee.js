const validator=require("validator");
const validatee=(req)=>{
    const {email,password,firstName,lastName}=req.body;
    if(!validator.isEmail(email)){
        throw new Error(" email id is not valid")
    }
    if(!validator.isStrongPassword(password)){
        throw new Error(" enter a strong password")
    }
    if(firstName.length<3 && lastName.length<3){
        throw new Error(" the first name and last name should be greater than 3 character");
    }

}
const validateProfileData=(req)=>{
const allowedFields=["firstName","lastName","about","age","gender","photourl","about"];
isUpdateValid=Object.keys(req.body).every(feild=>allowedFields.includes(feild));
console.log(isUpdateValid);
return isUpdateValid;
}
module.exports= {validatee,validateProfileData}