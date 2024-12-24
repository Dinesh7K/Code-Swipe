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
const validatesendConnection=(status)=>{
    const allowedStatus=["connect","ignore"]
    if(allowedStatus.includes(status)){
      return true
    }
    else{
      return false
    }
}
const validaterecieveConnection=(status)=>{
  const allowedStatus=["accept","reject"]
  if(allowedStatus.includes(status)){
    return true
  }
  else{
    return false
  }

}

module.exports= {validateAge,validateToken,validatesendConnection,validaterecieveConnection}