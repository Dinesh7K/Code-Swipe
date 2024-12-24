const mongoose = require("mongoose");

const requestConnectionSchema = new mongoose.Schema(
  {
    fromUserid: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    toUserid: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["connect", "ignore","accept","reject"],
        message: "{VALUE} is not allowed",
      },
    },
  },
  { timestamps: true }
);

const requestConnection=mongoose.model("requetsConnection",requestConnectionSchema)

module.exports=requestConnection