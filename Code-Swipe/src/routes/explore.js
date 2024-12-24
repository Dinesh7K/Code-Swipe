const express = require("express");
const exploreRoute = express.Router();
const User = require("../models/user");
const Connection = require("../models/requestConnection");
const { loginAuth } = require("../middlewares/auth");

exploreRoute.get("/user/explore/feed", loginAuth, async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;

    limit = limit > 50 ? 50 : limit;

    let skip = (page - 1) * limit;
    const availableData = [
      "firstName",
      "userName",
      "lastName",
      "skills",
      "image",
      "gender",
      "age",
    ];

    const availableConnections = await Connection.find({
      $or: [{ fromUserid: req.userId }, { toUserid: req.userId }],
    });
    const notApplicableUsers = new Set();
    availableConnections.forEach((user) => {
      notApplicableUsers.add(user.fromUserid);
      notApplicableUsers.add(user.toUserid);
    });
    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(availableConnections) } },
        { _id: { $ne: req.userId } },
      ],
    })
      .select(availableData)
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      availableConnections: feedUsers,
    });
    
  } catch (err) {
    res.status(404).json({
      message: "Not able to show anything",
      error: err.message,
    });
  }
});

module.exports = { exploreRoute };
