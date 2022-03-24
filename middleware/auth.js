const jwt = require("jsonwebtoken");

module.exports = authorize;
const { query } = require("../util");

async function authorize(req, res, next) {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer") ||
      !req.headers.authorization.split(" ")[1]
    ) {
      return res.status(401).json({
        error: true,
        message: "Token missing in header!",
      });
    }
    const accessToken = req.headers.authorization.split(" ")[1]; //since Bearer actual_token_string
    const decoded = await jwt.verify(accessToken, process.env.secret);
    const userData = await query(
      `SELECT * FROM user where user_id="${decoded.id}"`
    );
    console.log(userData);
    if (!userData?.length) {
      return res.status(404).send({ error: true, message: "User not found!" });
    }
    let [user] = userData;
    delete user.password;
    req.user = user;
    next();
  } catch (e) {
    switch (e.name) {
      case "TokenExpiredError":
        return res
          .status(401)
          .send({ error: true, message: "Access Token Expired!" });
      case "JsonWebTokenError":
        return res
          .status(401)
          .send({ error: true, message: "Illegal Access token" });
      default:
        return res.status(500).send({ error: true, message: e.message });
    }
  }

  //   return [
  //     // authenticate JWT token and attach decoded token to request as req.user
  //     jwt({ secret, algorithms: ["MD5"] }),

  //     // attach full user record to request object
  //     async (req, res, next) => {
  //       // get user with id from token 'sub' (subject) property
  //       const user = await query(
  //         `SELECT * FROM user where username="${req.body.username}"`
  //       );
  //       console.log(user);
  //       db.User.findByPk(req.user.sub);

  //       // check user still exists
  //       if (!user) return res.status(401).json({ message: "Unauthorized" });

  //       // authorization successful
  //       req.user = user.get();
  //       next();
  //     },
  //   ];
}
