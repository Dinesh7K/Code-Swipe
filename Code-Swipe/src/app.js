const express = require("express");

const app = express();

const {adminAuth,userAuth}=require("./middlewares/auth")

app.use('/admin',adminAuth)


app.get('/admin/getAll',(req,res)=>{
   res.send('Received all data of admin')
})
app.get('/admin/login',(req,res)=>{
    res.send("Login Page is loaded")
})
app.get('/user/data',userAuth,(req,res)=>{
  res.send("User Data is sent")
})
app.post('/user/details',(req,res)=>{
   res.send("Get all data from user")
})



app.listen(3000, () => {
  console.log("Server is successfully running on port:3000...");
});


