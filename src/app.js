const express=require("express");
const app=express()
const connectDB=require("../database.js")
const User=require("../models/user.js")

app.post("/signup",async (req,res)=>{
    const userObj={
        firstName:"Kha",
        lastName:"vashee",
        emailId:"vasee@db.com",
        password:"Vashee@123"
    }
    const user=new User(userObj);
   await  user.save();
   res.send("user added successfully");
})
app.use("/",(req,res)=>{
    res.send("hello bhai kaisa hai");
    })
connectDB().then(()=>{
    app.listen(3000,(req,res)=>{
        console.log("server is listening on 3000 port")
        })
}).catch((err)=>{
console.error("Database cannot be connected!!");
});



