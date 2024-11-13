const express=require('express')

const app=express()

app.use("/intro",(req,res)=>{
  res.send('Welcome to the app')
})

app.use("/hello",(req,res)=>{
    res.send('Hello Dinesh')
})

app.use("/not",(req,res)=>{
    res.send('Not a valid')
})

app.listen(3000,()=>{
    console.log("Server is successfully running on port:3000...")
})
