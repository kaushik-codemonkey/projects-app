// node native promisify
const mysqlConnection = require("./connection");
const util = require("util");
const query = util.promisify(mysqlConnection.query).bind(mysqlConnection);
module.exports = { query };
