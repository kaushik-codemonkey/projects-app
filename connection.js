const mysql = require("mysql");
const util = require("util");
const bcrypt = require("bcryptjs");

var mysqlConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "projects",
  multipleStatements: true,
});

// node native promisify
const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);

async function runMigration() {
  const categoryPromise = () =>
    new Promise((resolve, reject) =>
      mysqlConnection.query(
        "SELECT * from category",
        async (err, rows, fields) => {
          try {
            if (err?.code === "ER_NO_SUCH_TABLE") {
              await query(`CREATE TABLE category (
            c_id int NOT NULL AUTO_INCREMENT,
            category_name varchar(255) NOT NULL,
            PRIMARY KEY (c_id)
            );`);
              await query(
                "INSERT INTO category (category_name) VALUES ('Healthcare'),('Finance'),('Market Analysis');"
              );
              console.log("Completed migration - Category ");
              resolve();
            }
          } catch (e) {
            console.log("Failed migration - Category ");
            reject(e);
          }
        }
      )
    );

  const userPromise = () =>
    new Promise((resolve, reject) =>
      mysqlConnection.query("SELECT * from user", async (err, rows, fields) => {
        try {
          if (err?.code === "ER_NO_SUCH_TABLE") {
            await query(`CREATE TABLE user (
                              user_id int NOT NULL AUTO_INCREMENT,
                              username varchar(255) NOT NULL UNIQUE,
                              password varchar(255) NOT NULL,
                              PRIMARY KEY (user_id)
                              );`);
            await query(
              `INSERT INTO user (username,password) VALUES("admin","${await bcrypt.hash(
                "12345678",
                12
              )}")`
            );
            console.log("Completed migration - User ");
            resolve();
          }
        } catch (e) {
          console.log("Failed migration - User ");
          reject(e);
        }
      })
    );
  const projectPromise = () =>
    new Promise((resolve, reject) =>
      mysqlConnection.query(
        "SELECT * from project",
        async (err, rows, fields) => {
          try {
            if (err?.code === "ER_NO_SUCH_TABLE") {
              await query(`CREATE TABLE project (
                      project_id int NOT NULL AUTO_INCREMENT,
                      user_id int,
                c_id int,
                title varchar(255) NOT NULL,
                PRIMARY KEY (project_id),
                FOREIGN KEY (user_id) REFERENCES user(user_id),
                FOREIGN KEY (c_id) REFERENCES category(c_id)
            );`);
              await query(
                `INSERT INTO project (user_id,c_id,title) VALUES(1,1,"Hospital Order Fulfillment")`
              );
              await query(
                `INSERT INTO project (user_id,c_id,title) VALUES(1,1,"Hospital Equipment Audit Software")`
              );
              await query(
                `INSERT INTO project (user_id,c_id,title) VALUES(1,1,"Patient Details Maintainence Project")`
              );
              console.log("Completed migration - Project ");
              resolve();
            }
          } catch (e) {
            console.log("Failed migration - Project ");

            reject(e);
          }
        }
      )
    );
  try {
    await categoryPromise();
    await userPromise();
    await projectPromise();
  } catch (e) {
    console.log("Migration Failed!", e);
  }
}

mysqlConnection.connect((err) => {
  if (err) console.log("Connection failed", err);
  else {
    console.log("Connected!");
    runMigration();
  }
});
module.exports = mysqlConnection;
