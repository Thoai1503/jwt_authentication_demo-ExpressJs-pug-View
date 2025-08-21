const ErrorResponse = require("../utils/errorResponse");
const User = require("../model/User");
const jwt = require("jsonwebtoken");

const UserRepository = require("../repository/user");

// Protect routes
exports.checkToken = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  } else {
    return res.redirect("/login");
  }

  token = req.cookies.token;

  if (!token) {
    res.status(403).json("You're not authenticated");
  }

  try {
    const decoded = jwt.verify(token, "thoaichodien");
    const userRepo = new UserRepository();
    req.user = await userRepo.getUserByEmail(decoded.email);

    if (!decoded) {
      return res.redirect("/login");
    }

    next();
  } catch (err) {
    return res.redirect("/login");
  }
};
