const express = require("express");
const dbConnect = require("./config/db");
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoutes");
const bodyParser = require("body-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 1234;
const cookieParser = require("cookie-parser")

dbConnect();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

app.use("/api/user", authRouter);
app.use("/api/product", productRouter)

app.use(notFound)
app.use(errorHandler)

app.use("/", (req, res) => {
  res.send(`server is started at ${PORT} port`);
});

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
