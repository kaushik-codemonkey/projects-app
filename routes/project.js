const { query } = require("../util");
const express = require("express");
const Router = express.Router();
const mysqlConnection = require("../connection");
const authorize = require("../middleware/auth");

//GET /project/?orderBy=username&listOrder=DESC&limit=4&page=1
Router.get("/", authorize, async (req, res) => {
  try {
    //query - orderBy(project, created, username, catergory), listOrder(ASC, DESC), limit(int), page(int)
    //authorization
    var numRows;
    var numPerPage = parseInt(req.query.limit, 10) || 2;
    var page = parseInt(req.query.page, 10) || 1;
    var numPages;
    var skip = (page - 1) * numPerPage;
    // Here we compute the LIMIT parameter for MySQL query
    var limit = skip + "," + numPerPage;
    const [countData] = await query(`SELECT count(*) as numRows FROM project 
    LEFT JOIN user ON project.user_id=user.user_id 
    LEFT JOIN category ON category.c_id=project.c_id`);
    numRows = countData.numRows;
    numPages = Math.ceil(numRows / numPerPage);
    //for orderBy filter
    let orderBy;
    switch (req.query?.orderBy) {
      case "project":
        orderBy = "project.title";
        break;
      case "username":
        orderBy = "user.username";
        break;
      case "category":
        orderBy = "category.category_name";
        break;
      case "created":
      default:
        orderBy = "project.project_id";
        break;
    }
    let listOrder = req.query.listOrder || "ASC"; //or DESC
    let paginationData;
    //Join Project - User + Left Join it with Categories
    const joinedData =
      await query(`SELECT project.project_id, project.title,user.username,category.category_name FROM project 
    LEFT JOIN user ON project.user_id=user.user_id 
    LEFT JOIN category ON category.c_id=project.c_id
    ORDER BY ${orderBy} ${listOrder} LIMIT ${limit}`);
    mysqlConnection.query("SELECT * from project", (err, rows, fields) => {
      if (err) {
        console.error(err);
      } else {
        paginationData = {
          current: page,
          limit: numPerPage,
          total: numRows,
        };
        res.send({ data: joinedData, pagination: paginationData });
      }
    });
  } catch (e) {
    res.status(500).send({ error: true, message: e.message });
  }
});

module.exports = Router;
