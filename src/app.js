const express = require("express");
const app = express();
const connectDB = require("../database.js");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser())
const auths=require("./routers/auths.js");
const profile=require("./routers/profile.js");
const request=require("./routers/request.js")
app.use("/",auths);
app.use("/",profile);
app.use("/",request);

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
