const bcrypt = require("bcryptjs");
const express = require("express");
const jwt = require("jsonwebtoken");
const authorize = require("../middleware/auth");
const Router = express.Router();
const { query } = require("../util");
Router.post("/register", async (req, res) => {
  try {
    const existingUsers = await query(
      `SELECT username FROM user where username="${req.body.username}"`
    );
    if (existingUsers.length)
      return res
        .status(201)
        .send({ error: true, message: "Username already taken" });
    const hashPass = await bcrypt.hash(req.body.password, 12);
    await query(
      `INSERT INTO user (username,password) VALUES("${req.body.username}","${hashPass}")`
    );
    const [userData] = await query(
      `SELECT user_id,username FROM user WHERE username="${req.body.username}"`
    );
    const accessToken = jwt.sign({ id: userData.user_id }, process.env.secret, {
      expiresIn: process.env.validity,
    });
    return res.send({ data: userData, accessToken });
  } catch (e) {
    res.status(500).send({ error: true, message: e.message });
  }
});

Router.post("/login", async (req, res) => {
  try {
    if (!(req.body.username || req.body.password))
      return res
        .status(400)
        .send({ error: true, message: "Username or password is missing!" });

    const userData = await query(
      `SELECT * FROM user where username="${req.body.username}"`
    );
    if (!userData?.length)
      return res.status(404).send({ error: true, message: "User not found!" });
    //Verify password
    const passMatch = await bcrypt.compare(
      req.body.password,
      userData[0].password
    );
    if (!passMatch)
      return res.status(422).json({
        error: true,
        message: "Incorrect password",
      });
    const accessToken = jwt.sign(
      { id: userData[0].user_id },
      process.env.secret,
      {
        expiresIn: process.env.validity,
      }
    );
    delete userData[0].password;
    res.send({ userData: userData[0], token: accessToken });
  } catch (e) {
    res.status(500).send({ error: true, message: e.message });
  }
});

Router.get("/verifytoken", authorize, (req, res) => {
  console.log("adssad", req.user);
  if (req.user) {
    res.send({ verified: true });
  }
});
module.exports = Router;
