
const express = require("express");
const app = express();
require("dotenv").config();
const router = require("./routes/router");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");



app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));



app.use(express.urlencoded({ extended: true }));
app.use("/", router);



const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`App listening on port: ${port}`);
});