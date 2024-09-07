const jwt = require("jsonwebtoken");

const ApiError = require("../error/ApiError")
const {Basket} = require("../models/models");

class UserController {
  async registration(req, res) {
    const {email, password, role} = req.body
    if(!email || !password) {
      return next(ApiError.badRequest('Incorrect email or password'))
    }
    const candidate = await User.findOne({where: {email}})
    if (candidate) {
      return next(ApiError.badRequest('User already exists'))
    }
    const hashPassword = await bcrypt.hash(password, 5)
    const user = await User.create({email, role, password: hashPassword})
    const basket = await Basket.create({userId: user.id})
    const token = jwt.sign({id: user.id, email: user.email, role}, process.env.SECRET_KEY, {expiresIn: '24h'})
    return res.json();
  }

  async login(req, res) {

  }

  async check(req, res, next) {
    const query = req.query
    if (!query.id) {
      return next(ApiError.badRequest('Undefined ID!'))
    }
    res.json(query)
  }
}

module.exports = new UserController()