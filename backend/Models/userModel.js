const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { type } = require("os");

// name, email, password, confirmPassword, photo
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name."],
  },
  email: {
    type: String,
    required: [true, "Please enter your email."],
    unique: true,
    lowercase: true,
    validator: [validator.isEmail, "Please enter a valid email."],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please enter your password."],
    minLength: 8,
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password."],
    validate: {
      // this validator will only work for save() and create()
      validator: function (val) {
        return val == this.password;
      },
      message: "Password & confirm password does not match",
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // encrypt the password before saving it
  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
  next();
});

userSchema.pre(/^find/, function(next) {
  // this keyword in the function will point to current query
  this.find({active: {$ne: false}});
  next();
})

userSchema.methods.comparePasswordInDb = async function (pswd, pswdDB) {
  return await bcrypt.compare(pswd, pswdDB);
};

userSchema.methods.isPasswordChanged = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const pswdchangedTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10
    );
    console.log(pswdchangedTimestamp, JWTTimestamp);
    return JWTTimestamp < pswdchangedTimestamp;
  }
  return false;
};

userSchema.methods.createResetPasswordToken = function () {
  // 1. Generate a random token (32 bytes)
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 2. Encrypt the token and store it in DB (for security)
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 3. Set expiration time (10 minutes)
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  console.log("Reset Token (send to user):", resetToken);
  console.log("Hashed Token (saved in DB):", this.passwordResetToken);

  return resetToken; // return plain token to send via email
};

const User = mongoose.model("User", userSchema);

module.exports = User;
