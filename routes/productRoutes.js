const express = require("express");
const { createProduct, getAProduct } = require("../controller/product.controller");
const router = express.Router();

router.post("/",createProduct)
router.get("/:id",getAProduct)

module.exports = router