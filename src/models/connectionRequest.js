const mongoose=require("mongoose");
const connectionRequest=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:{
            values:["ignore","interested","accepted","rejected"],
            message:`{VALUE} is incorrect Status type`
        }
    }
},{timestamps:true})

//compound index due to this your searching will become very fast
connectionRequest.index({fromUserId:1,toUserId:1});
// connectionRequest.pre("save",function(){

// })
const connectionRequestModel=new mongoose.model("connectionRequest",connectionRequest);
module.exports=connectionRequestModel;