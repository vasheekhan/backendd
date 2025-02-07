const express=require("express");
const profile=express.Router();
const {userAuth}=require("../middlewares/auth")
const {validateProfileData}=require("../utils/validatee");
const bcrypt=require("bcrypt")
const validator=require("validator");

profile.get("/profile/view",userAuth,async(req,res)=>{
    const user=req.user;
   res.send(`here is the profile of ${user.firstName}\n`+user);
  })
profile.patch("/profile/update",userAuth,async(req,res)=>{
    
    try{
        const updateValid=validateProfileData(req);
    if(!updateValid){
        throw new Error("Profile Update is not valid")
    }
    const loggedInUser=req.user;
    Object.keys(req.body).forEach(key=>loggedInUser[key]=req.body[key])
    await loggedInUser.save();
  
    res.json({
        message:`${loggedInUser.firstName}, your Profile is updated successfully` ,
       data:loggedInUser
    })
}catch(err){
        res.status(400).send("Update is not valid")
    }
})
profile.post("/changepassword", userAuth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = req.user; // Authenticated user

        // Verify the current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Current password is incorrect." });
        }

        // Prevent using the same password again
        if (currentPassword === newPassword) {
            return res.status(400).json({ message: "New password cannot be the same as the old password." });
        }

        // Validate new password strength
        if (!validator.isStrongPassword(newPassword)) {
            return res.status(400).json({ message: "Password is not strong enough." });
        }

        // Hash and update new password
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "Password updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error.", error: error.message });
    }
});


  module.exports=profile;