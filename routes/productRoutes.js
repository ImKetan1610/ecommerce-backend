const express = require("express");
const {
  createProduct,
  getAProduct,
  getAllProducts,
  updateAProduct,
  deleteAProduct,
} = require("../controller/product.controller");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);
router.get("/:id", getAProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteAProduct);
router.get("/", getAllProducts);
router.put("/:id", authMiddleware, isAdmin, updateAProduct);

module.exports = router;
