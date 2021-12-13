const bcrypt = require("bcrypt");
const uuid = require("uuid");
const UserModel = require("../models/user-model");
const MailService = require("../service/mail-service");

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });

    if (candidate) {
      throw new Error(
        `Пользователь с почтовым адресом ${email} уже существует!`
      );
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const activationLink = uuid.v4(); // v34fa-1234-34h42-sds
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    });

    await MailService.sendActivationMail(email, activationLink);
  }
}

module.exports = new UserService();
