const adminAuth=(req,res,next)=>{
    console.log("Admin Authentication is Processing")
    const authentication_token="xyz"
    const generated_token="abc"
    if(authentication_token===generated_token){
        next()
    }
    else{
        res.status(401).send("Unauthorized Request")
    }

}
const userAuth=(req,res,next)=>{
    console.log("User Authentication is Processing")
    const authentication_token="abc"
    const generated_token="dd"
    if(authentication_token===generated_token){
        next()
    }
    else{
        res.status(401).send("Unauthorized Request")
    }

}
module.exports={
    adminAuth,userAuth
}
