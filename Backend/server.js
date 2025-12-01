const express=require('express')
const app=express();
require('dotenv').config()
const port=process.env.port ||4000

app.get('/',(req,res)=>{
    res.send("WELCOME TO HOMEPAGE")
})


app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})