const express = require("express");
const router = express.Router();
const authController = require("../Controllers/authController");

const userController = require("../Controllers/userController");

router.get(
  "/getAllUsers",
  userController.getAllUsers
);


router.patch(
  "/updatePassword",
  authController.protect,
  userController.updatePassword
);

router.patch(
  "/updateMe",
  authController.protect,
  userController.updateMe
);


router.delete(
  "/deleteMe",
  authController.protect,
  userController.deleteMe
);

module.exports = router;
