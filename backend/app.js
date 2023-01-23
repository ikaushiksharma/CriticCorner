const express = require('express')
const userRouter = require('./routes/user.js')
const app = express()
const mongoose = require('mongoose')
const port = 8000
app.use(express.json())
const mongoUrl =
  'mongodb+srv://admin-kaushik:Test123@cluster0.meubq.mongodb.net/movieReview?retryWrites=true&w=majority'
mongoose.connect(mongoUrl, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('connected to mongoose')
})

app.use('/api/user', userRouter)

// middleware example
app.post(
  '/sign-in',
  (req, res, next) => {
    const { email, password } = req.body
    if (!email || !password) return res.json({ error: 'email/password missing!' })
    next()
  },
  (req, res) => {
    res.send('<h1>Hello I am about page</h1>')
  },
)

app.listen(port, () => console.log(`Movie Review App is listening on port ${port}!`))
