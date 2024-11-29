const { UpdateUserDto, LoginUser } = require("./user.dtos");
const User = require("./user.model");

exports.restartUserDatabase = async (req, res) => {
  try {
    const result = await User.restartUserDatabase(); // Assuming this is a Promise-based function
    return res.status(200).json({ message: result });
  } catch (err) {
    return res.status(400).json({ message: err.message || err });
  }
};

exports.getAllUser = async (req, res) => {
  try {
    const result = await User.getAllUser(); // Assuming this is a Promise-based function
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message || err });
  }
};

exports.getUserById = async (req, res) => {
  console.log("getUserById", Number(req.params.id));
  const id = Number(req.params.id);
  try {
    const result = await User.getUserById(id); // Assuming this is a Promise-based function
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message || err });
  }
};

exports.getUserByMssv = async (req, res) => {
  const mssv = Number(req.params.mssv);
  console.log("getUserByMssv", mssv);
  try {
    const result = await User.getUserByMssv(mssv); // Assuming this is a Promise-based function
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message || err });
  }
};

exports.getMyProfile = async (req, res) => {
  const user = req.user;
  return res.status(200).json(user);
};

exports.getUserByEmail = async (req, res) => {
  console.log("getUserByEmail");
  const email = req.params.email;
  try {
    const result = await User.getUserByEmail(email); // Assuming this is a Promise-based function
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message || err });
  }
};

exports.updateUser = async (req, res) => {
  const id = Number(req.params.id);
  const updateUserDto = new UpdateUserDto(req.body);
  try {
    const result = await User.updateUserById(id, updateUserDto); // Assuming this is a Promise-based function
    console.log("updateUser result", result);
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: result });
  } catch (err) {
    return res.status(400).json({ message: err.message || err });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await User.deleteUserById(id); // Assuming this is a Promise-based function
    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted", result });
  } catch (err) {
    return res.status(400).json({ message: err.message || err });
  }
};

exports.getPageBalance = async (req, res) => {
  
  const mssv = Number(req.params.mssv);
  try{
    const result = await User.getPageBalanceByMSSV(mssv);
    if (!result) {
      return res.status(404).json({ message: "Page balance not found" });
    }
    
    return res.status(200).json({message: "query success", result});
  } catch(err){
    throw new Error(err);
  }
}

exports.updatePageBalance = async (req, res) => {
  
  const mssv = Number(req.params.mssv);
  const pageBalance = Number(req.body.pageBalance);
  try{
    const result = await User.updatePageBalanceByMSSV(mssv, pageBalance);
    if (!result) {
      return res.status(404).json({ message: "Page balance not found" });
    }
    console.log(result);
    return res.status(200).json({message: "Successfully", result});
  } catch(err){
    throw new Error(err);
  }
}