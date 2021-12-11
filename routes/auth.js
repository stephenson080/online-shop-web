const express = require("express")
const { check, body } = require("express-validator/check")
const User = require("../models/user")

const router = express.Router()

const { getLoginPage, login, logout, getSignup, signup, getResetPassword, resetPassword, getNewPasswordPage, changePassword } = require("../controllers/auth")

router.get("/login", getLoginPage)
router.post("/login",
   [check("email").isEmail().withMessage("Please enter a Valid email!").custom((value, { req }) => {
      return User.findOne({ email: value })
         .then(user => {
            if (!user) {
               return Promise.reject("Email not found Database")
            }
         })
   }).normalizeEmail(),
   body("password").isLength({ min: 5 }).trim()
      .withMessage("Password should be greater than 5 chacters").isAlphanumeric().withMessage("Password must contain alphabet and numbers")
   ], login)

router.post("/logout", logout)

router.get("/signup", getSignup)

router.post("/signup",
   [check("email").isEmail().withMessage("Please enter a Valid email!").custom((value, { req }) => {
      return User.findOne({ email: value })
         .then(user => {
            if (user) {
               return Promise.reject("Email already Taken by another User")
            }
         })
   }).normalizeEmail(),
   body("password").isLength({ min: 5 }).trim()
      .withMessage("Password should be greater than 5 chacters").trim().isAlphanumeric().withMessage("Password must contain alphabet and numbers"),
   body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
         throw new Error("Both Password fields must match")
      }
      return true
   })
   ],
   signup)

router.get("/reset", getResetPassword)

router.post("/reset", resetPassword)

router.get("/reset-password/:token", getNewPasswordPage)

router.post("/new-password", changePassword)

module.exports = router