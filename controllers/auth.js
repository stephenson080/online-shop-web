const User = require('../models/user')
const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")
const sendgrid = require("nodemailer-sendgrid-transport")
const crypto = require("crypto")
const { validationResult } = require("express-validator/check")

const transporter = nodemailer.createTransport(sendgrid({
  auth: {
    api_key: process.env.SENDGRID_API_KEY
  }
}))

exports.getLoginPage = (req, res, next) => {
  let message = req.flash("error")
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    errorMessage: message,
    oldInput: { email: '', password: '' },
    errorValidation: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error")
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/signup', {
    path: '/signup',
    docTitle: 'Signup',
    errorMessage: message,
    oldInput: { email: '', password: '', confirmPassword: '' },
    errorValidation: []
  });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      path: '/login',
      docTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: { email: '', password: '' },
      errorValidation: errors.array()
    });
  }
  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.render('auth/login', {
          path: '/login',
          docTitle: 'Login',
          errorMessage: 'Invalid Email or password',
          oldInput: { email: email, password: password },
          errorValidation: errors.array()
        });
      }
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            req.flash("error", "Invalid Password")
            return res.render('auth/login', {
              path: '/login',
              docTitle: 'Login',
              errorMessage: 'Invalid Email or password',
              oldInput: { email: email, password: password },
              errorValidation: errors.array()
            });
          }
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save(err => {
            res.redirect('/');
          });
        })
    })
    .catch(err => {
      const error = new Error(err.message)
      error.statusCode = 500
      return next(error)
  });
};

exports.signup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('auth/signup', {
      path: '/signup',
      docTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput: { email: email, password: password, confirmPassword: confirmPassword },
      errorValidation: errors.array()
    })
  }
  return bcrypt.hash(password, 12)
    .then(hashPassword => {
      const user = new User({
        email: email, password: hashPassword, cart: { items: [] }
      })
      return user.save()
    })
    .then(result => {
      req.flash("message", "Registration Succesful!")
      res.redirect("/login")
      transporter.sendMail({
        to: email,
        from: "stevepathagoras08@gmail.com",
        subject: "Registration Successful",
        html: "<h1>Welcome<h1>"
      })
    })
    .catch(err => {
      const error = new Error(err.message)
      error.statusCode = 500
      return next(error)
  })
};

exports.logout = (req, res, next) => {
  req.session.destroy(err => {
    if(err){
      return res.redirect('/500')
    }
    res.redirect('/');
  });
};

exports.getResetPassword = (req, res, next) => {
  let message = req.flash("error")
  if (message.length > 0) {
    message = message[0]
  } else {
    message = null
  }
  res.render('auth/reset', {
    path: '/reset-password',
    docTitle: 'Reset Password',
    errorMessage: message
  });
}

exports.resetPassword = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err)
      return res.redirect("/reset")
    }
    const token = buffer.toString("hex")
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          req.flash("error", "Email not Found in DataBase")
          return res.redirect("/reset")
        }
        user.token = token
        user.toExp = Date.now() + 3600000
        user.save()
          .then(() => {
            res.redirect("/")
            transporter.sendMail({
              to: user.email,
              from: "stevepathagoras08@gmail.com",
              subject: "Reset Password",
              html: `<p>You Requested to reset your password</p>
                 <P>Click this link <a href= "${process.env.BASIC_URL}/reset-password/${token}">reset</a> your password
                `
            })
          })
          .catch(err=>  {
            const error = new Error(err.message)
            error.statusCode = 500
            return next(error)
          })
      })
      .catch(err => {
        const error = new Error(err.message)
        error.statusCode = 500
        return next(error)
    })
  })
}
exports.getNewPasswordPage = (req, res) => {
  const token = req.params.token
  User.findOne({ token: token, toExp: { $gt: Date.now() } })
    .then(user => {
      let message = req.flash("error")
      if (message.length > 0) {
        message = message[0]
      } else {
        message = null
      }
      res.render('auth/new-password', {
        path: '/new-password',
        docTitle: 'Update Password',
        errorMessage: message,
        userId: user._id.toString(),
        token: token
      });
    })
    .catch(err => {
      const error = new Error(err.message)
      error.statusCode = 500
      return next(error)
  })

}

exports.changePassword = (req, res) => {
  const token = req.body.token
  const userId = req.body.userId
  const password = req.body.password
  let resetUser
  User.findOne({ token: token, toExp: { $gt: Date.now() }, _id: userId })
    .then(user => {
      resetUser = user
      return bcrypt.hash(password, 12)
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword
      resetUser.toExp = undefined
      resetUser.token = undefined
      return resetUser.save()
    })
    .then(() => {
      res.redirect("/login")
    })
    .catch(err => {
      const error = new Error(err.message)
      error.statusCode = 500
      return next(error)
  })
}


