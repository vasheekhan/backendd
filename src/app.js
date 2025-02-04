const express = require("express");
const app = express();
const connectDB = require("../database.js");
const User = require("./models/user.js");
const bcrypt=require("bcrypt");
const validatee=require("./utils/validatee.js")
const jwt=require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {userAuth}=require("./middlewares/auth.js")
app.use(express.json());
app.use(cookieParser())

app.post("/signup", async (req, res) => {
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
app.post("/login",async (req,res)=>{
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

})
app.get("/profile",userAuth,async(req,res)=>{
  const user=req.user;
 res.send(`here is the profile of ${user.firstName}\n`+user);
})
app.get("/sendconnectionrequest",userAuth,(req,res)=>{
  res.send("request send successfully");
})
app.get("/feed", async (req, res) => {
  try {
    const usersss = await User.findOne({});
    res.send(usersss);
  } catch (err) {
    console.log("something went wrong" + err);
    res.status(404).send("something went wrong please try again later");
  }
});
app.delete("/user", async (req, res) => {
  const users = await User.findByIdAndDelete({
    _id: "679c4b825a7d89a3d9625712",
  });
  console.log(users);
  res.send("user delete successfully");
});
app.patch("/user/:userId", async (req, res, err) => {

  try {
    const data = req.body;
    const userId=req.params?.userId
    const bodyID=req.body.userId
    const email=req.body.email;
    const allowedUpdate=["photourl","about","gender","age","skills"];
    console.log(Object.keys(data))
    const isUpdateAllowed=Object.keys(data).every((k)=>allowedUpdate.includes(k))//object.keys(data) give the array of keys .every k includes
    console.log(isUpdateAllowed)
    if(!isUpdateAllowed){
      throw new Error("update not alloweddddd")
    }
    if(email ){
      throw new Error("email cannot  be updated");
    }
    if(bodyID){
      throw new Error("userId can not be updated")
    }
    console.log(data);

    const user = await User.findByIdAndUpdate(userId, data,{runValidators:true});
    res.send("user updated successfully");
  } catch (err) {
    res.status(401).send(err.message);
  }
});
app.use("/", (req, res) => {
  res.send("hello bhai kaisa hai");
});
connectDB()
  .then(() => {
    app.listen(3000, (req, res) => {
      console.log("database is connected ");
      console.log("server is listening on 3000 port");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
