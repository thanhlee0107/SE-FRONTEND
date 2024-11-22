class CreateUserDto {
  constructor({name, mssv, password, email, sex, pageBalance, role}) {
    this.name = name;
    this.mssv = mssv;
    this.password = password;
    this.email = email;
    this.sex = sex;
    this.role=role;
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
