const User = require("../Models/userModel");
const asyncErrorHandler = require("../Utils/aysncErrorHandler");
const jwt = require("jsonwebtoken");
const CustomError = require("../Utils/CustomError");
const util = require("util");
const sendEmail = require("../Utils/email");
const crypto = require('crypto');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.SECRATE_STR, {
    expiresIn: process.env.LOGIN_EXPIRES,
  });
};

exports.createSendResponse = (user, statusCode, res) => {
  const token = signToken(user._id);

  const options = {
    maxAge: process.env.LOGIN_EXPIRES,
    httpOnly: true
  }

  if(process.env.NODE_ENV === 'production') 
    options.secure = true;

  res.cookie('jwt', token,options);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  exports.createSendResponse(newUser, 201, res);
})

exports.login = asyncErrorHandler(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  //const {email, password} = req.body
  // Check if email & password is present is request body
  if (!email || !password) {
    const error = new CustomError(
      "Please provide email id & password for login in!",
      400
    );
    return next(error);
  }

  // Check if user exists with given email
  const user = await User.findOne({ email }).select("+password");

  //const isMatch = await user.comparePasswordInDb(password, user.password);

  // Check if the user exists & password matches
  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    const error = new CustomError("Incorrect email or password", 400);
    return next(error);
  }
  // 3. Send JWT token
exports.createSendResponse(user, 200, res);
});

exports.protect = asyncErrorHandler(async (req, res, next) => {
  // 1️⃣ Get token from header
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return next(
      new CustomError("You are not logged in! Please login to get access.", 401)
    );
  }

  // 2️⃣ Verify token
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRATE_STR
  );

  // 3️⃣ Check if user still exists
  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) {
    return next(
      new CustomError("The user belonging to this token no longer exists.", 401)
    );
  }

  // 4️⃣ Check if user changed password after token was issued
  if (currentUser.isPasswordChanged(decodedToken.iat)) {
    return next(
      new CustomError(
        "User recently changed password! Please login again.",
        401
      )
    );
  }

  // 5️⃣ Grant access
  req.user = currentUser;
  next();
});


exports.restrict = (role) => {
  return (req, res, next) => {
    if (req.user !== role) {
      const error = new CustomError(
        "You do not have permission to perform this action",
        403
      );
      next(error);
    }
    next();
  };
};

/*
exports.restrict = (...role) => {
  return (req, res, next) => {
    if(!role.includes(req.user.role)){
      const error = new CustomError('You do not have permission to perform this action', 403);
      next(error);
    }
    next();
  }
} */

exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  //1. GET USER BASED ON POSTED EMAIL
  const user = await User.findOne({ email: req.body.email });

 if (!user) {
  return next(new CustomError("We could not find the user with given email", 404));
}


  //2. SEND THE TOKEN BACK TO THE USER EMAIL
  const resetToken = user.createResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //3. SEND THE TOKEN BACK TO THE USER EMAIL
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `We have received a password reset request. Please use the below link to reset your password\n\n${resetUrl}\n\n This reset password link will be valid only for 10 minute.`;
  try {
     await sendEmail({
    email: user.email,
    subject: 'Password change request received',
    message: message
  });

  res.status(200).json({
    status: 'success',
    message: 'Password reset link send to the user email'
  })
  }catch(err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.save({validateBeforeSave: false});

    return next( new CustomError('There was an error sending password reset email. Please try again later', 500));
  }
  
  
 
});
exports.resetPassword = asyncErrorHandler (async (req, res, next) => {
  // IF THE USER EXIST WITH THE GIVEN TOKEN & TOKEN HAS EXPIRED
  const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({passwordResetToken: token, passwordResetTokenExpires: {$gt: Date.now()}})

  if(!user) {
    const error = new CustomError('Token is invalid or has expired!',400 );
    next(error);
  }

  // RESETING THE USER PASSWORD
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangeAt = Date.now();

  user.save();

  // LOGIN THE USER
  createSendResponse(user, 200, res);
});



