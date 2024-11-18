const authMethod = require("./auth.methods");
const userModel = require("../user/user.model");
const { CreateUserDto } = require("../user/user.dtos");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const validateHCMUTEmail = (email) => {
  return typeof email === "string" && email.endsWith("@hcmut.edu.vn");
};

exports.register = async (req, res) => {
  if (!validateHCMUTEmail(req.body.email)) {
    return res
      .status(400)
      .send("Invalid email address (must be @hcmut.edu.vn)");
  }
  const user = await userModel.getUserByEmail(req.body.email);
  if (user) res.status(409).send("Account already exists");
  else {
    const hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
    const newUser = new CreateUserDto(req.body);
    newUser.password = hashPassword;
    const createUser = await userModel.createUser(newUser, (err, result) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
      return res.status(201).json({ message: "User created", result });
    });
    if (!createUser) {
      return res.status(400).send("Failed to create account, please try again");
    }
    return res.send({
      msg: "register success",
      user: createUser,
    });
  }
};

exports.login = async (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  const user = await userModel.getUserByEmail(email);
  if (!user) {
    return res.status(401).send("username not found.");
  }
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).send("password is incorrect.");
  }

  const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  const dataForAccessToken = {
    id: user.id,
    email: user.email,
    mssv: user.mssv,
    name: user.name,
  };
  const accessToken = await authMethod.generateToken(
    dataForAccessToken,
    accessTokenSecret,
    accessTokenLife
  );
  if (!accessToken) {
    return res
      .status(401)
      .send("Failed to create access token, please try again.");
  }

  return res.json({
    msg: "login success",
    accessToken,
    // user,
  });
};

exports.verifyToken = (req, res) => {
  // Retrieve token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1];

  // Check if the token is provided
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

 
  authMethod.verifyToken(token, process.env.ACCESS_TOKEN_SECRET)
    .then((decoded) => {
      console.log("Token verification successful:", decoded);
      
      return res.status(200).json({
        message: "Token is valid"
      });
    })
    .catch((err) => {
      if (err.name === "TokenExpiredError") {
        
        return res.status(401).json({ message: "Token has expired" });
      } else {
        
        console.error("Token verification failed:", err.message);
        return res.status(403).json({ message: "Invalid token" });
      }
    });
};
