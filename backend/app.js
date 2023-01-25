const express = require('express')
require("express-async-errors");
const mongoose = require('mongoose')
const morgan = require('morgan')
const userRouter = require('./routes/user.js')
const errorHandler = require("./middlewares/error.js")

const app = express()
require('dotenv').config()
const port = 8000
app.use(express.json())

const mongoUrl = process.env.MONGO_URI
mongoose.connect(mongoUrl, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('connected to mongoose')
})
app.get("/", (req, res) => {
  res.send(`${errorHandler}`)
})
app.use(morgan("dev"));
app.use("/api/user", userRouter);

app.use(errorHandler);
// console.log(errorHandler)
app.listen(port, () => console.log(`Movie Reviewer is listening on port ${port}!`))
