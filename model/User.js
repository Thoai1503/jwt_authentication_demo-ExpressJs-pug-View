const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = class User {
  id = 0;
  name = "";
  email = "";
  username = "";
  password = "";
  status = 0;
  static USER_TABLE = "users";
  static ID_COLUMN = "id";
  static NAME_COLUMN = "name";
  static EMAIL_COLUMN = "email";
  static USERNAME_COLUMN = "username";
  static PASSWORD_COLUMN = "password";

  static STATUS_COLUMN = "status";
  constructor(id, name, email, username, password, status) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password;

    this.status = status;
  }

  getId() {
    return this.id;
  }
  setId(id) {
    this.id = id;
  }
  getName() {
    return this.name;
  }
  setName(name) {
    this.name = name;
  }
  getEmail() {
    return this.email;
  }
  setEmail(email) {
    this.email = email;
  }
  getUserName() {
    return this.username;
  }
  setUserName(phone) {
    this.username = phone;
  }
  getPassword() {
    return this.password;
  }
  setPassword(password) {
    this.password = password;
  }

  getStatus() {
    return this.status;
  }
  setStatus(status) {
    this.status = status;
  }

  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  async comparePassword(password) {
    return await bcrypt.compare(password, this.password.trim());
  }

  generateAuthToken() {
    const token = jwt.sign({ id: this.id, email: this.email }, "thoaichodien", {
      expiresIn: "1h",
    });
    return token;
  }
  static getUserTable() {
    return this.USER_TABLE;
  }
};
