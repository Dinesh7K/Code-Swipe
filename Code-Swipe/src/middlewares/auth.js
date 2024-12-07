const jwt=require('jsonwebtoken')
const {validateToken}=require("../utils/validate")

const loginAuth=async(req,res,next)=>{

  const{token}=req.cookies
  try{
    if(!token){
      throw new Error('Session Expired')
    }
    if(!validateToken(token)){
      throw new Error("Invalid Token")
    }
    const {_id}=validateToken(token)   
    req.userId=_id
    next()
  }
  catch(err){
    res.status(401).send(err.message)
  }

}
module.exports = {
  loginAuth
};
