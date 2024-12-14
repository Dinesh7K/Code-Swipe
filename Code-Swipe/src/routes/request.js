const express = require("express");
const requestRoute = express.Router();
const { loginAuth } = require("../middlewares/auth");
const { validatesendConnection } = require("../utils/validate");
const Connection = require("../models/requestConnection");
const User = require("../models/user");

requestRoute.post(
  "/request/send/:status/:toUserId",
  loginAuth,
  async (req, res) => {
    const fromUserId = req.userId;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    try {
      const requestIdValidtion = await Connection.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId, status: "ignore" },
          { fromUserId: toUserId, toUserId: fromUserId, status: "connect" },
        ],
      });
      if (requestIdValidtion || fromUserId == toUserId) {
        throw new Error("Invalid connection request");
      }

      if (!validatesendConnection(status)) {
        throw new Error("Invalid status type");
      }
      let connection=new Connection({
        fromUserid:fromUserId,
        ToUserid:toUserId,
        status:status
      })
      await connection.save()
      res.status(200).json({
        message: "Connection Request Successful",
      });
    } catch (err) {
      res.status(404).json({
        message: "Connection Request Failed!!",
        error: err.message
      });
    }
  }
);
module.exports={requestRoute}
