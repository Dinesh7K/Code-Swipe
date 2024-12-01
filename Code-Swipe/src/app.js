const express = require("express");
const connectDB = require("./config/database");
const app = express();

const { adminAuth, userAuth,loginAuth } = require("./middlewares/auth");
const {validateSignupdata}=require('./utils/validate')
const User = require("./models/user");
const bcrypt=require("bcrypt")
const cookieparser=require('cookie-parser')
const jwt=require('jsonwebtoken')

app.use(express.json());
app.use(cookieparser())
app.post("/signup", async (req, res) => {

  const date=new Date(req.body.dob)
  const now=new Date()
  let age=now.getFullYear()-date.getFullYear()
  const thisyear=new Date(now.getFullYear(),date.getMonth(),date.getDate())
  
  if(now<thisyear){
    age--
  }
  if(req.body.age!=age){
    req.body.age=age
  }
  if(req.body.about===""){
    req.body.about=`${req.body.firstName} ${req.body.lastName}`
  }
  req.body.password= await validateSignupdata(req)
  
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added succesfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});
app.post("/login",async(req,res)=>{
   const {email,password}=req.body
   let user=await User.findOne({email:email})
   try{
   
    if(user&& await user.validatePassword(password)){
      const token= await user.getJWT()
      res.cookie('token',token)
      res.send("Login Successful")
    }
    else{
      throw new Error('Invalid Credentials')
    }
   }
   catch(error){
     res.status(404).send(error.message)
   }
})
app.get("/user", async (req, res) => {
  const useremail = req.body.email;
  try {
    const user = await User.findOne({email:useremail})
    if (!user) {
      res.status(404).send("User does not exist");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went Wrong...");
  }
});
app.get("/profile/user",loginAuth,async(req,res)=>{
  try{
    const user=req.user
    res.send(user)
  }
  catch(err){
    res.send(err.message)
  }
})
app.get('/feed',async(req,res)=>{
   const useremail=req.body.email;
   try{
    const user=await User.find({email:useremail})
    if(user.length===0){
      res.status(404).send("Users not found")
      
    }
    else{
      res.send(user)
    }
   }
   catch(err){
    res.status(400).send('Something went wrong...')
   }
})
app.put('/user',async(req,res)=>{

  try{
  const user=await User.findOneAndUpdate({email:"a@gmail.com"},{email:"a1@gmail.com"},{returnDocument:"after"})
  res.send(user)
  console.log(user)
  }
  catch(err){
    res.status(404).send("Not working")
  }

})

connectDB()
  .then(() => {
    console.log("Database connected Successfully...");
    app.listen(3000, () => {
      console.log("Server is successfully running on port:3000...");
    });
  })
  .catch((err) => {
    console.log("Database cannot be connected...");
  });
