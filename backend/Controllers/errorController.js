const CustomError = require("../Utils/CustomError");

// GLOBAL ERROR HANDLER MIDDLEWARE

// Send detailed error info in development
const devError = (res, err) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "Internal Server Error",
    stack: err.stack,
    error: err,
  });
};

const castErrorHandler = (err) => {
  const msg = `Invalid value for ${err.path}: ${err.value}!`;
  return new CustomError(msg, 400);
};

const validationErrorHanlder = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const errorMessages = errors.join(". ");
  const msg = `Invalid input data: ${errorMessages}`;

  return new CustomError(msg, 400);
};

const handleExpiredJWT = (err) => {
  return new CustomError("JWT is has expired. Please login again", 401);
};

const handleJWTError = (err) => {
  return new CustomError('Invalid token. Please login again', 401);
}

const duplicateKeyErrorHandler = (err) => {
  const name = err.keyValue.name;
  const msg = `There is already a movie with name ${name}. Please use another name!`;
  return new CustomError(msg, 400);
};

// Send minimal, user-friendly error in production
const prodError = (res, err) => {
  if (err.isOperational) {
    // Known (expected) error
    res.status(err.statusCode || 500).json({
      status: err.status || "error",
      message: err.message,
    });
  } else {
    // Programming or unknown error
    res.status(500).json({
      status: "error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

// Exported middleware function
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    devError(res, err);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = castErrorHandler(err);
    if (err.code === 11000) err = duplicateKeyErrorHandler(err);
    if (err.name === "ValidationError") err = validationErrorHandler(err);
    if (err.name === "TokenExpiredError") err = handleExpiredJWT(err);
    if (err.name === "JsonWebTokenError") err = handleJWTError(err);

    prodError(res, err);
  }
};

