const userModel = require("../user/user.model");
const authMethod = require("./auth.methods");

const handleUnauthorized = (res, message = "Unauthorized") => {
  return res.status(401).json({ message });
};

exports.isAuth = async (req, res, next) => {
  try {
    // Retrieve access token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) return handleUnauthorized(res);

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    const verified = await authMethod.verifyToken(token, accessTokenSecret);
    if (!verified) {
      return handleUnauthorized(
        res,
        "Unauthorized access token, please login again"
      );
    }

    // console.log("Verified Payload:", verified.payload);
    const user = await userModel.getUserById(verified.payload.id);
    req.user = user;

    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return handleUnauthorized(res, "An error occurred during authorization");
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.role !== "admin") {
      return handleUnauthorized(res, "Unauthorized access, admin only");
    }

    next();
  } catch (error) {
    console.error("Authorization error:", error);
    return handleUnauthorized(res, "An error occurred during authorization");
  }
};