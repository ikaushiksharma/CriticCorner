const express = require("express");
require("express-async-errors");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const userRouter = require("./routes/user.js");
const actorRouter = require("./routes/actor.js");
const movieRouter = require("./routes/movie.js");
const reviewRouter = require("./routes/review.js");
const adminRouter = require("./routes/admin.js");
const errorHandler = require("./middlewares/error.js");
const { handleNotFound } = require("./utils/helper");

const app = express();
require("dotenv").config();
const port = 8000;
app.use(express.json());
app.use(cors());

const mongoUrl = process.env.MONGO_URI;
mongoose.connect(mongoUrl, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log("connected to mongoose");
});
app.get("/", (req, res) => {
  res.send(`${errorHandler}`);
});
app.use(morgan("dev"));
app.use("/api/user", userRouter);
app.use("/api/actor", actorRouter);
app.use("/api/movie", movieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/admin", adminRouter);
app.use("/*", handleNotFound);

app.use(errorHandler);
// console.log(errorHandler)
app.listen(port, () => console.log(`Movie Reviewer is listening on port ${port}!`));
