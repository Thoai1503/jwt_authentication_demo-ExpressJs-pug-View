const User = require("../model/User");

module.exports = class MemberControllerAPI {
  userRepository = null;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  getAccount = async (req, res, next) => {
    try {
      const email = req.query.email;
      const user = await this.userRepository.getUserByEmail(email);
      if (!user) {
        res.status(401).json({ message: "Not found", success: false });
      }
      const userModel = new User(
        user?.id,
        user?.name,
        user?.email,
        user?.phone,
        user?.password,

        1
      );
      this.sendTokenResponse(userModel, 200, res);
    } catch (err) {
      next(err);
    }
  };
  checkAccount = async (req, res, next) => {
    const { email, password } = req.body;
    try {
      const user = await this.userRepository.getUserByEmail(email);
      console.log("password:", user.getPassword().trim());

      if (!user || !(await user.comparePassword(password))) {
        return res
          .status(401)
          .json({ message: "Invalid credentials", success: false });
      }
      this.sendTokenResponse(user, 201, res);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  };
  createNewUser = async (req, res, next) => {
    const { name, email, username, password } = req.body;

    try {
      const existingUser = await this.userRepository.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const newUser = new User(0, name, email, username, password, 1);
      await newUser.hashPassword();
      newUser.setStatus(1);

      const createdUser = await this.userRepository.createUser(newUser);
      if (!createdUser) {
        res
          .status(404)

          .json({
            success: false,
          });
      }
      this.sendTokenResponse(createdUser, 201, res);
    } catch (error) {
      next(error);
    }
  };
  sendTokenResponse = (user, statusCode, res) => {
    const token = user.generateAuthToken();
    return res
      .status(statusCode)
      .cookie("token", token)

      .json({
        success: true,
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
  };
};
