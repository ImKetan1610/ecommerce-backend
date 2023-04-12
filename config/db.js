const mongoose = require("mongoose");

const dbConnect = () => {
  try {
    const connect = mongoose.connect(process.env.DB_URL);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
  console.log("Database Connected Successfully");
};

module.exports = dbConnect;
