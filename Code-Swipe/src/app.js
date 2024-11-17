const express = require("express");
const connectDB=require("./config/database")
const app = express();

const {adminAuth,userAuth}=require("./middlewares/auth")
const User=require('./models/user')

app.post('/signup',async(req,res)=>{
   const user=new User({
    firstName:"abc",
    lastName:"d",
    dob:"04/03/2002",
    email:"abc@gmail.com",
    password:"hello124"
   });
   try{
   await user.save() 
   res.send("Useer added succesfully")
   }
   catch(err){
    res.status(500).send("unable to add")
   }
});

connectDB()
 .then(()=>{
  console.log("Database connected Successfully...")
  app.listen(3000, () => {
    console.log("Server is successfully running on port:3000...");
  });
}).catch((err)=>{
  console.log("Database cannot be connected...")
})



