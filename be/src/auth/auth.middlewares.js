// const userModle = require("../users/users.models");

const authMethod = require("./auth.methods");

exports.isAuth = async (req, res, next) => {
  // Lấy access token từ header
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  const verified = await authMethod.verifyToken(token, accessTokenSecret);
  if (!verified) {
    return res
      .status(401)
      .send("Unauthorized access token, please login again");
  }

  //   const user = await userModle.getUser(verified.payload.username);
  //   req.user = user;

  return next();
};
