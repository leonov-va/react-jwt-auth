const bcrypt = require("bcrypt");
const uuid = require("uuid");
const UserModel = require("../models/user-model");
const MailService = require("../service/mail-service");
const TokenService = require("../service/token-service");
const UserDto = require("../dtos/user-dto");
const tokenService = require("../service/token-service");

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

    await MailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    );

    const userDto = new UserDto(user); // id, email, isActivated
    const tokens = TokenService.generateTokens({ ...userDto });

    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink });

    if (!user) {
      throw new Error("Некоректная ссылка активации");
    }

    user.isActivated = true;
    await user.save();
  }
}

module.exports = new UserService();
