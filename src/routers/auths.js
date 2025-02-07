const express=require("express");
const {validatee}=require("../utils/validatee")
const bcrypt=require("bcrypt")
const User=require("../models/user");
const auths=express.Router();
auths.post("/signup", async (req, res) => {
    console.log(req.body);
    const {email, password, firstName, lastName,gender,skills,photourl} = req.body;
    
    try {
      validatee(req);
      const userExist = await User.findOne({ emailId: email });
      if (userExist) {
        return res.status(400).send("email is already in use"); // 🔹 Add return to stop execution
      }
  const passwordHash=await bcrypt.hash(password,10)
      const response = await User.create({
        emailId: email,
        password:passwordHash,
        firstName,
        lastName,
        gender,
        skills,
        photourl
      },);
      console.log(response, "User saved successfully ");
      res.status(201).send(
        "User created successfully"
      );
    } catch (err) {
      res.status(404)
        .send("something went wrong please try again later" + err.message);
    }
  });
auths.post("/login",async (req,res)=>{
    try{
      const {email,password}=req.body; 
      const user=await User.findOne({emailId:email})
      if(!user){
        throw new Error("Invalid credentials");
      }
      // const isPasswordValid=await bcrypt.compare(password,user.password)
      const isPasswordValid=await user.validatePassword(password)
    if(!isPasswordValid){
      throw new Error("Invalid Credentials");
    }
    else{
        // const token= jwt.sign({_id:user._id},"Vashee@Bhai");
    const token=await user.getJWT()
        res.cookie("token",token);
        res.send("Login Successful");
     
    }
    }
    catch (err) {
        res.status(404)
          .send("ERROR " + err.message);
      }
    
 });
auths.post("/logout",async(req,res)=>{
  res.cookie("token", "", { expires: new Date(0) });
res.send("Logout successfull");
})

 module.exports=auths;