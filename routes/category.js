const express = require("express");
const Router = express.Router();
const mysqlConnection = require("../connection");
const authorize = require("../middleware/auth");
const { query } = require("../util");

Router.get("/", authorize, (req, res) => {
  try {
    mysqlConnection.query("SELECT * from category", (err, rows, fields) => {
      console.log("Reachere here", rows);
      if (err) {
        console.error(err);
      } else {
        res.send(rows);
      }
    });
  } catch (e) {
    return res.status(500).send({ error: true, message: e.message });
  }
});

module.exports = Router;
