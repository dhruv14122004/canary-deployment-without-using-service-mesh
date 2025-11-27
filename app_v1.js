const express = require('express')
const app = express()
app.get("/",(req,res)=>{
  res.send("It is the Stable Version")
})
app.listen(8080, ()=>console.log("Stable V1 is running"))