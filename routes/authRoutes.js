const express = require("express");
const {
  createUser,
  loginUserControl,
  getAllUsers,
  getAUser,
  deleteAUser,
  updateAUser,
} = require("../controller/user.controller");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUserControl);
router.get("/all-users", getAllUsers);
router.get("/:id", authMiddleware, getAUser);
router.delete("/:id", deleteAUser);
router.put("/:id", updateAUser);

module.exports = router;
