var express = require("express");
var router = express.Router();
var { checkToken } = require("../middleware/checkToken");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
router.get("/login", function (req, res, next) {
  res.render("login", { title: "login" });
});
router.get("/myprofile", checkToken, function (req, res, next) {
  console.log("Token: " + req.cookies.token);
  res.render("myprofile", { title: "myprofile", user: req.user });
});

module.exports = router;
