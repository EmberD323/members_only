
const { Router } = require("express");
const controller = require("../controllers/controller");
const router = Router();
const passport = require("passport");
const db = require("../db/queries.js");
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require("bcryptjs");


passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await db.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
        return done(null, false, { message: "Incorrect password" })
        }
        return done(null, user);
      } catch(err) {
        return done(err);
      }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
try {
    const user = await db.getUserByID(id);
    done(null, user);
} catch(err) {
    done(err);
}
});
  
router.get("/", controller.homepageGet);
router.get("/signup", controller.signUpGet);
router.post("/signup", controller.signUpPost);
router.post("/signin",
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/"
    })
);
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
  
//next steps:1)join the club and change member status.2)create new message
module.exports = router;
