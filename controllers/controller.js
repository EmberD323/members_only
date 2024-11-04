const db = require("../db/queries.js");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
require("dotenv").config();



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

const validateJoin= [
    body("passcode").custom(async value => {
      const passcode = process.env.SECRET_PASSCODE;
      if (value != passcode) {
        throw new Error('Passcode incorrect, entry denied');
      }
    })
];
  

validateCreate = [
    body("title").trim()
      .isLength({ min: 1, max: 30 }).withMessage(`Title must be between 1 and 15 characters.`),
    body("message").trim()
      .isLength({ min: 1, max: 500 }).withMessage(`Message must be between 1 and 500 characters.`),
]


async function homepageGet (req, res) {
    let messages = await db.getAllMessages()
    res.render("homepage", { 
        user: req.user,
        messages:messages });

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
            const {firstName,lastName,username,password,passwordConfirm,admin} = req.body
            await db.addUser(firstName,lastName,username,hashedPassword,admin);
            res.redirect('/');
          });
    }
  ]

async function joinGet (req, res) {
    res.render("join", { user: req.user });
}

joinPost =[
    validateJoin,
    async function (req, res) {
      const user = req.user;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("join", {
          errors: errors.array(),
          user: user
        });
      }
      await db.updateMembership(user);
        res.redirect('/');
    }
  ]

async function createGet (req, res) {
    res.render("create", { user: req.user });
}

createPost =[
    validateCreate,
    async function (req, res) {
      const user = req.user;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render("create", {
          errors: errors.array(),
          user: user
        });
      }
      let currentDate = (new Date()).toString();
      await db.addMessage(user.id,currentDate,req.body.title,req.body.message);
        res.redirect('/');

    }
]

async function deleteMessagePost (req, res) {
    const {messageid} = req.params;
    await db.deleteMessage(messageid);
    res.redirect("/");
}
module.exports = {
  homepageGet,
  signUpGet,
  signUpPost,
  joinGet,
  joinPost,
  createGet,
  createPost,
  deleteMessagePost
};