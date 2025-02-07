const express=require("express");
const request=express.Router();
const {userAuth}=require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequest");
const User = require("../models/user");
// request.get("/sendconnectionrequest",userAuth,(req,res)=>{
//     res.send("request send successfully");
//   })
request.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
  try{
    const loggedInUser=req.user;
const fromUserId=req.user._id;
const toUserId=req.params.toUserId;
const reciever=await User.findById(toUserId);
const status=req.params.status;
const allowedStatus=["ignored","interested"];
if(!allowedStatus.includes(status)){
  return res.status(400).send("Invalid status type")
}
const requestedUserExist=await User.findById(toUserId);
if(!requestedUserExist){
  throw new Error("Requested user does not exists");
}
if(fromUserId.equals(toUserId)){
  throw new Error("you can not send connection request to yourself");
}
const existingConnectionRequest=await connectionRequestModel.findOne({
  $or: [
    { fromUserId: fromUserId, toUserId: toUserId }, 
    { fromUserId: toUserId, toUserId: fromUserId }
  ]  
})
if(existingConnectionRequest){
  throw new Error("Connection request already exist")
}
const connectionRequest=new connectionRequestModel({
  fromUserId,
  toUserId,
  status
})
const data=await connectionRequest.save();
res.send(`Request sent! ${reciever.firstName} will see it soon. Stay tuned!`);
  }
  catch(err){
    res.status(500).send("Internal server error !!!! "+err.message)
  }
})
  module.exports=request;