const authMethod = require("./auth.methods");

exports.register = async (req, res) => {
  const username = req.body.username.toLowerCase();
  const user = await userModel.getUser(username);
  if (user) res.status(409).send("Account already exists");
  else {
    const hashPassword = bcrypt.hashSync(req.body.password, SALT_ROUNDS);
    const newUser = {
      username: username,
      password: hashPassword,
      // Add more fields here
    };
    const createUser = await userModel.createUser(newUser);
    if (!createUser) {
      return res.status(400).send("Failed to create account, please try again");
    }
    return res.send({
      username,
    });
  }
};

exports.login = async (req, res) => {
  const username = req.body.username.toLowerCase() || "test";
  const password = req.body.password || "12345";

  //   const user = await userModel.getUser(username);
  //   if (!user) {
  //     return res.status(401).send("username not found.");
  //   }

  //   const isPasswordValid = bcrypt.compareSync(password, user.password);
  //   if (!isPasswordValid) {
  //     return res.status(401).send("password is incorrect.");
  //   }

  const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  const dataForAccessToken = {
    // username: user.username,
    username: username,
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
