const axios = require("axios");
const User = require("../model/User");

module.exports = class AuthController {
  userRepository = null;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/checkAccount",
        {
          email: email,
          password: password,
        }
      );
      if (!data.success) {
        return res.status(404).json({ message: data.message });
      }

      const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      };

      res.cookie("token", data.token, cookieOptions);

      return res.redirect("/myprofile");
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  };

  register = async (req, res, next) => {
    const { name, email, username, password } = req.body;
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/createNewUser",
        {
          name: name,
          email: email,
          username: username,
          password: password,
        }
      );
      if (!data.success) {
        return res.status(404).json({ message: "Register Error" });
      }
      return res.redirect("/login");
    } catch (error) {
      next(error);
    }
  };
  logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
  };
};
