const User = require("../model/User");

module.exports = class UserRepository {
  constructor() {}

  async getUserByEmail(email) {
    const { sql, getPool } = require("../db/MssqlDb");
    const pool = await getPool();
    const request = pool.request();
    request.input("email", sql.NVarChar, email);
    const result = await request.query(
      "SELECT * FROM member WHERE email = @email"
    );
    if (result.recordset.length > 0) {
      const user = result.recordset[0];

      return new User(
        user.id,
        user.name,
        user.email,
        user.username,
        user.password,

        user.status
      );
    }

    return null;
  }

  async createUser(user) {
    const { sql, getPool } = require("../db/MssqlDb");
    const pool = await getPool();
    const request = pool.request();
    request.input("name", sql.NVarChar, user.getName());
    request.input("email", sql.NVarChar, user.getEmail());
    request.input("username", sql.NVarChar, user.getUserName());
    request.input("password", sql.NVarChar, user.getPassword());

    request.input("status", sql.Int, user.getStatus());
    const result = await request.query(
      "INSERT INTO member (name, email, username, password, active) VALUES (@name, @email, @username, @password, @status); SELECT SCOPE_IDENTITY() AS id"
    );

    const userRs = new User(
      result.recordset[0].id,
      user.name,
      user.email,
      user.username,
      user.password,
      user.status
    );
    return userRs;
  }
  async updateUser(id, user) {
    const { sql, getPool } = require("../db/MssqlDb");
    const pool = await getPool();
    const request = pool.request();
    request.input("id", sql.Int, id);
    request.input("name", sql.NVarChar, user.name);
    request.input("email", sql.NVarChar, user.email);
    request.input("phone", sql.NVarChar, user.phone);
    request.input("password", sql.NVarChar, user.password);
    request.input("role", sql.Int, user.role);
    request.input("status", sql.Int, user.status);
    await request.query(
      "UPDATE users SET name = @name, email = @email, phone = @phone, password = @password, role = @role, status = @status WHERE id = @id"
    );
    return { id };
  }
};
