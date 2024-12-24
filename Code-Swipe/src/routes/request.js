const express = require("express");
const requestRoute = express.Router();
const connectionRoute = express.Router();
const { loginAuth } = require("../middlewares/auth");
const {
  validatesendConnection,
  validaterecieveConnection,
} = require("../utils/validate");
const Connection = require("../models/requestConnection");

requestRoute.post(
  "/request/send/:status/:toUserId",
  loginAuth,
  async (req, res) => {
    const fromUserId = req.userId;
    const { toUserId, status } = req.params;

    try {
      if (!validatesendConnection(status)) {
        throw new Error("Invalid status type");
      }

      const requestIdValidtion = await Connection.findOne({
        $or: [
          { fromUserid: fromUserId, toUserid: toUserId, status: "connect" },
          { fromUserid: toUserId, toUserid: fromUserId, status: "connect" },
        ],
      });

      if (requestIdValidtion || fromUserId == toUserId) {
        throw new Error("Invalid connection request");
      }

      let connection = new Connection({
        fromUserid: fromUserId,
        toUserid: toUserId,
        status: status,
      });
      await connection.save();
      res.status(200).json({
        message: "Connection Request Successful",
      });
    } catch (err) {
      res.status(404).json({
        message: "Connection Request Failed!!",
        error: err.message,
      });
    }
  }
);
requestRoute.post(
  "/request/review/:status/:requestId",
  loginAuth,
  async (req, res) => {
    const { status, requestId } = req.params;

    const userId = req.userId;
    try {
      if (!validaterecieveConnection(status)) {
        throw new Error("Invalid Status type");
      }
      let responseValidation;
      if (status == "reject") {
        responseValidation = await Connection.findOne({
          $or: [
            {
              _id: requestId,
              toUserid: userId,
              status: "connect",
            },
            {
              _id: requestId,
              toUserid: userId,
              status: "accept",
            },
          ],
        });
      } else {
        responseValidation = await Connection.findOne({
          _id: requestId,
          toUserid: userId,
          status: "connect",
        });
      }
      if (!responseValidation) {
        throw new Error("Invalid Connection Request");
      }

      let updateRequest = await Connection.findByIdAndUpdate(
        { _id: requestId },
        {
          status: status,
        },
        { runValidators: true, returnDocument: "after" }
      );
      await updateRequest.save();
      res.status(200).json({
        message: "Connection Response Successful",
      });
    } catch (err) {
      res.status(404).json({
        message: "Connection Response Failed",
        error: err.message,
      });
    }
  }
);

connectionRoute.get("/user/allconnections", loginAuth, async (req, res) => {
  try {
    
    const allowedData=[
      "firstName",
      "userName",
      "lastName",
      "skills",
      "image",
      "gender",
      "age",
      "dob",
      "about"
    ]
    let allConnections = await Connection.find({
      $or: [
        { toUserid: req.userId, status: "accept" },
        { fromUserid: req.userId, status: "accept" },
      ],
    }).populate("fromUserid",allowedData).populate("toUserid",allowedData);
    allConnections=allConnections.map((row)=>{
      if(row.fromUserid._id.toString()===req.userId.toString()){
        return row.toUserid
      }
      return row.fromUserid
    })
    res.status(200).json({
      "Connections":allConnections
    })
  } catch (err) {
    res.send(404).json({
      message:"Connection List failed",
      error:err.message
    })
  }
});
connectionRoute.get("/user/requests/pending", loginAuth, async (req, res) => {
  try {
    
    const allowedData=[
      "firstName",
      "userName",
      "lastName",
      "skills",
      "image",
      "gender",
      "age",
    ]
    let pendingrequestsdata = await Connection.find({
      toUserid: req.userId,
      status: "connect",
    }).populate("fromUserid",allowedData );
    pendingrequestsdata = pendingrequestsdata.map((row) => row.fromUserid);
    res.status(200).json({

      "pendingRequest":pendingrequestsdata
    });
  } catch (err) {
    res.send(404).json({
      message: "Pending Request Failed",
      error: err.message,
    });
  }
});
module.exports = { requestRoute, connectionRoute };
