const express = require("express");
const userRoute = express.Router();
const User = require("../models/user");
const { validateAge } = require("../utils/validate");

userRoute.post("/signup", async (req, res) => {
  let { dob, email, username } = req.body;

  try {
    req.body.age = validateAge(dob);
    let user = new User(req.body);
    if (await User.findOne({ email: email })) {
      throw new Error ("Emailid alreadys exists");
    }
    if (await User.findOne({ username: username })) {
      throw new Error ("Username alreadys exists");
    }
    await user.save();
    res.send("User Added Succesfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});
userRoute.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email: email });

    if (!user || !(await user.validateHashPassword(password))) {
      throw new Error("Invalid Credentials");
    }

    const jwttoken = user.setJWT();
    res.cookie("token", jwttoken, { maxAge: 9000000 });
    res.status(200).send(`${user.firstName} has Successfully LoggedIn`);
  } catch (err) {
    res.status(401).send(err.message);
  }
});
userRoute.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.status(200).send("Successfully LoggedOut");
  } catch (err) {
    res.status("400").send(err.message);
  }
});

module.exports = { userRoute };
