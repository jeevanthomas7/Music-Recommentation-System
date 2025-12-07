const express=require('express');
const { connectDB } = require('./config/db');
const app=express();
require('dotenv').config()
const port=process.env.port ||4000

connectDB()
app.get('/',(req,res)=>{
    res.send("WELCOME TO HOMEPAGE")
})


app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})