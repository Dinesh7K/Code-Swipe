const jwt=require('jsonwebtoken')
const User=require("../models/user")

const adminAuth = (req, res, next) => {
  console.log("Admin Authentication is Processing");
  const authentication_token = "xyz";
  const generated_token = "abc";
  if (authentication_token === generated_token) {
    next();
  } else {
    res.status(401).send("Unauthorized Request");
  }
};
const userAuth = (req, res, next) => {
  console.log("User Authentication is Processing");
  const authentication_token = "abc";
  const generated_token = "dd";
  if (authentication_token === generated_token) {
    next();
  } else {
    res.status(401).send("Unauthorized Request");
  }
};
const loginAuth=async(req,res,next)=>{
  const {token}=req.cookies
  try{
  if(!token){
    throw new Error("Token not found!!!!")
  }
  const decodedObj=jwt.verify(token,"CODEswip#45")
  const {_id}=decodedObj
  if(decodedObj && _id){
    const user=await User.findById({_id:_id})
    if(user){
    req.user=user
    next()
    }
    else{
      throw new Error("User not found")
    }
  }
  else{
    throw new Error("Invalid Token")
  }}
  catch(err){
    res.status(400).send(err.message)
  }

}
module.exports = {
  adminAuth,
  userAuth,
  loginAuth
};
