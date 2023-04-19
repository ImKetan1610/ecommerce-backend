const express = require("express");
const { createProduct } = require("../controller/product.controller");
const router = express.Router();

router.post("/",createProduct)

module.exports = router