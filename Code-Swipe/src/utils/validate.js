
const bcrypt=require('bcrypt')

const validateSignupdata=async(req)=>{
   const {password}=req.body
   const passwordHash= await bcrypt.hash(password,15)
   return passwordHash
}
module.exports= {validateSignupdata}