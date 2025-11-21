const User = require("../Models/userModel");
const asyncErrorHandler = require("../Utils/aysncErrorHandler");
const jwt = require("jsonwebtoken");
const CustomError = require("../Utils/CustomError");
const util = require("util");
const sendEmail = require("../Utils/email");
const crypto = require('crypto');
const authController = require('./authController')

exports.getAllUsers = asyncErrorHandler( async (req,res,next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    result: users.length,
    data: {
      users,
    }
  })
})

const filterReqIbj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(prop=> {
    if(allowedFields.includes(prop))
       newObj[prop] = obj[prop];
  })
  return newObj
}





exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  // 1️⃣ GET CURRENT USER DATA FROM DATABASE
  const user = await User.findById(req.user._id).select('+password');

  // 2️⃣ CHECK IF THE SUPPLIED CURRENT PASSWORD IS CORRECT
  const isPasswordCorrect = await user.comparePasswordInDb(
    req.body.currentPassword,
    user.password
  );

  if (!isPasswordCorrect) {
    return next(new CustomError('The current password you provided is wrong', 401));
  }

  // 3️⃣ IF SUPPLIED PASSWORD IS CORRECT, UPDATE USER PASSWORD WITH NEW VALUE
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;

  await user.save(); // triggers password hashing from your pre('save') hook

  // 4️⃣ LOGIN USER AGAIN & SEND JWT
  authController.createSendResponse(user, 200, res);
});


exports.updateMe = asyncErrorHandler(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(new CustomError(
      'You cannot update your password using this endpoint', 
      400
    ));
  }

  // Only allow specific fields to update
  const filterObj = filterReqIbj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filterObj,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});


exports.deleteMe = asyncErrorHandler( async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {active: false});

  res.status(204).json({
    status: 'success',
    data: null
  })
})