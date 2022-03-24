const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, `./.env.${process.env.NODE_ENV || "development"}`),
});

const express = require("express");
const bodyParser = require("body-parser");
const CategoryRoutes = require("./routes/category");
const UserRoutes = require("./routes/user");
const ProjectRoutes = require("./routes/project");
const mysqlConnection = require("./connection");

var app = express();

//for pages
app.use(express.static("public"));

app.use(bodyParser.json());
app.use("/api/category", CategoryRoutes);
app.use("/api/user", UserRoutes);
app.use("/api/project", ProjectRoutes);
app.use((req, res, next) => {
  res.status(404).send();
});

let PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}.`);
});
