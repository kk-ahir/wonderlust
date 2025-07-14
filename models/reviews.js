const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReviewSchema=new Schema({
    comment:String,
    ratings:{
        type:Number,
        Min:1,
        Max:5
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});
module.exports=mongoose.model("Review",ReviewSchema);