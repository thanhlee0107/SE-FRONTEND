class CreateUserDto {
  constructor({ name, mssv, password, email, pageBalance }) {
    this.name = name;
    this.mssv = mssv;
    this.password = password;
    this.email = email;
    this.pageBalance = pageBalance;
  }
}

class LoginUserDto {
  constructor({ email, password }) {
    this.email = email;
    this.password = password;
  }
}

class UpdateUserDto {
  constructor({ name, pageBalance, mssv, password }) {
    this.name = name;
    this.pageBalance = pageBalance;
    this.mssv = mssv;
    this.password = password;
  }
}

module.exports = {
  CreateUserDto,
  LoginUserDto,
  UpdateUserDto,
};
