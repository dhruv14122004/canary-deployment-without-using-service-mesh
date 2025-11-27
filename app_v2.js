const express = require('express')
const app = express()
app.get("/",(req,res)=>{
  res.send("It is the canary Version")
})
app.listen(8080, ()=> console.log("Canary V2 is running"))