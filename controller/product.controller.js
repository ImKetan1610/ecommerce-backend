const Product = require("../models/product.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");

const createProduct = asyncHandler(async (req, res) => {
  try {
    res.json({
      message: "Hey it's create product route",
    });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { createProduct };
