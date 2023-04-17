const mongoose = require("mongoose");

const validateMongodbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) throw new Error(" This id is not valid or not found");
  else console.log("valid")
};

module.exports = { validateMongodbId };
