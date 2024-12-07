const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const validateAge=(dob)=>{
   dob=new Date(dob)
   const now=new Date()
   let calculatedage=now.getFullYear()-dob.getFullYear()
   const thisyear=new Date(now.getFullYear(),dob.getMonth(),dob.getDate())

   if(now<thisyear){
      calculatedage--
    }

    return calculatedage
   
   
}
const validateToken=(token)=>{
   const isValid=jwt.verify(token,"CODEswip#45")
   return isValid
}

module.exports= {validateAge,validateToken}