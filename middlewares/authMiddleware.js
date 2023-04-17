// we will verify the jwt token here and
// check the role of user i.e. user is admin or not

const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        const user = await User.findById(decoded?.id);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error(error + " token expires .Please Login Again");
    }
  } else {
    throw new Error("Invalid User: No Token is attached");
  }
});

// check the role of user i.e. user is admin or not
const isAdmin = asyncHandler(async (req, res, next) => {
  // console.log(req.user);
  const { email } = req.user;
  let adminUser = await User.findOne({ email });
  if (adminUser.role !== "admin") {
    throw new Error("you are not authorized to do this action");
  }else{
    next()
  }
});

module.exports = { authMiddleware, isAdmin };
