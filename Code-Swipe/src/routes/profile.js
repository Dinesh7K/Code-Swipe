const express = require("express");
const profileRoute = express.Router();
const { loginAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateAge } = require("../utils/validate");

profileRoute.get("/profile/view", loginAuth, async (req, res) => {
  const user = await User.findById({ _id: req.userId });
  res.status(200).json({ profileDetails: user });
});
profileRoute.post("/profile/edit", loginAuth, async (req, res) => {
  const editOptions = [
    "firstName",
    "lastName",
    "username",
    "dob",
    "gender",
    "image",
    "about",
    "skills",
  ];

  try {
    Object.keys(req.body).every((field) => {
      if (!editOptions.includes(field)) {
        throw new Error(`Unable to edit this ${field}`);
      }

      if (field == "dob") {
        const { dob } = req.body;
        req.body.age = validateAge(dob);
      }
    });
    let user = await User.findByIdAndUpdate({ _id: req.userId }, req.body, {
      returnDocument: "after",
      runValidators: true,
    });

    user.save();
    res.status(202).send({ profileDetails: user });
  } catch (err) {
    res.status(400).send(err.message);
  }
});
profileRoute.post("/profile/password", loginAuth, async (req, res) => {
  let user = await User.findById({ _id: req.userId })
  const { currentPassword, newPassword, confirmPassword } = req.body;
  try {
    if (!(await user.validateHashPassword(currentPassword))) {
      throw new Error("Current Password is Invalid");
    }

    if (currentPassword == newPassword) {
      throw new Error("New Password should not be the same as Old Password");
    }

    if (newPassword != confirmPassword) {
      throw new Error("Password Does not Match");
    }

    await User.findByIdAndUpdate({ _id: req.userId },{password:newPassword}, {
        returnDocument: "after",
        runValidators: true,
      });
    await user.setHashPassword()
    user.save();
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.status(202).send("Password has been updated");
    
  } catch (err) {
    res.status(400).send(err.message);
  }
});
module.exports = { profileRoute };
