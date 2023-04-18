const { generateToken } = require("../config/jwtToken");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { validateMongodbId } = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");

const createUser = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const findUser = await User.findOne({ email: email });
  if (!findUser) {
    //create new user
    const newUser = await User.create(req.body);
    return res.status(201).send(newUser);
  } else {
    // User already exist
    throw new Error("User already Exists");
    // return res.send({
    //   msg: "User already Exists",
    //   success: false,
    // });
  }
});

const loginUserControl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  //check if user exist or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateUser = await User.findByIdAndUpdate(
      findUser._id,
      {
        refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    return res.send({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// handle refresh token

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log(cookie);
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie?.refreshToken;
  console.log(refreshToken);
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("no token is present in db or no matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("Something is wrong with the refresh Token");
    }
    const accessToken = generateToken(user.id);
    res.status(200).send({ accessToken: accessToken });
  });
});

// Get All Users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    return res.status(200).send(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// get a single user
const getAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  // console.log(id);
  try {
    const getAUser = await User.findById(id);
    return res.status(200).send(getAUser);
  } catch (error) {
    throw new Error(error);
  }
});

// update the user
const updateAUser = asyncHandler(async (req, res) => {
  // const { id } = req.params; // we can get the id from user with the help of authMiddleware.js
  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      { new: true }
    );
    return res.status(200).send(updatedUser);
  } catch (error) {
    throw new Error(error);
  }
});

//delete a user
const deleteAUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteAUser = await User.findByIdAndDelete(id);
    return res.status(200).send(deleteAUser);
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
    return res.status(200).send(block);
  } catch (error) {
    throw new Error(error);
  }
});

const unBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
    return res.status(200).send(unblock);
  } catch (error) {
    throw new Error(error);
  }
});

//logout functionality

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie?.refreshToken;
  const user = await User.findOne({ refreshToken });
  if(!user){
    res.clearCookie("refreshToken",{
      httpOnly:true,
      secure:true
    })
    return res.sendStatus(204) //forbidden
  }
  await User.findOneAndUpdate("refreshToken",{
    refreshToken:""
  })
  res.clearCookie("refreshToken",{
    httpOnly:true,
    secure:true
  })
  res.sendStatus(204) //forbidden
});

module.exports = {
  createUser,
  loginUserControl,
  getAllUsers,
  getAUser,
  deleteAUser,
  updateAUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logout,
};
