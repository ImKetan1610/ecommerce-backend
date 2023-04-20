const express = require("express");
const {
  createProduct,
  getAProduct,
  getAllProducts,
  updateAProduct,
} = require("../controller/product.controller");
const router = express.Router();

router.post("/", createProduct);
router.get("/:id", getAProduct);
router.get("/", getAllProducts);
router.put("/:id", updateAProduct);

module.exports = router;
