const db = require("../db/queries.js");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");



const validateSignUp= [
  body("firstName").trim()
    .toLowerCase()
    .isLength({ min: 1, max: 15 }).withMessage(`First name must be between 1 and 15 characters.`),
  body("lastName").trim()
    .toLowerCase()
    .isLength({ min: 1, max: 15 }).withMessage(`Last name must be between 1 and 15 characters.`),
  body("username").custom(async value => {
    const user = await db.findUserByUsername(value);
    if (user) {
      throw new Error('E-mail already in use');
    }
  }),
  body("password").trim()
    .isLength({ min: 8}).withMessage(`Password must be between more than 8 characters.`),
  body('passwordConfirm').custom((value, { req }) => {
        return value === req.body.password;
    }).withMessage(`Passwords must match.`)
];

async function homepageGet (req, res) {
    res.render("homepage", { user: req.user });
}

async function signUpGet (req, res) {
    res.render("signup", {});
}


signUpPost = [
    validateSignUp,
    async function(req, res) {
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render("signup", {
                    errors: errors.array(),
                });
            }
            const {firstName,lastName,username,password} = req.body
            await db.addUser(firstName,lastName,username,hashedPassword);
            res.redirect('/');
          });
    }
  ]

module.exports = {
  homepageGet,
  signUpGet,
  signUpPost
};