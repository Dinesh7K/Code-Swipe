const mongoose = require("mongoose");

const requestConnectionSchema = new mongoose.Schema(
  {
    fromUserid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    ToUserid: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["connect", "ignore"],
        message: "{VALUE} is not allowed",
      },
    },
  },
  { timestamps: true }
);

const requestConnection=mongoose.model("requetsConnection",requestConnectionSchema)

module.exports=requestConnection