import { config } from 'dotenv';
import userServices from '../../Database/services/user';
import successRes from '../utils/successRes';
import ErrorResponse from '../utils/errorRes';
import User from '../../Database/models/user';
import encryption from '../helpers/encryption';

config();

const { findUser } = userServices;
const { signToken, hashPassword, checkPassword } = encryption;

class Auth {
  // @desc     User register
  // @route    GET /api/auth/register
  // access    Public,

  static async register(req, res, next) {
    try {
      const {
        firstName,
        surName,
        email,
        password,
        role,
      } = req.body;
      const existing = await findUser({ email: req.body.email });
      if (existing) return ErrorResponse(res, 400, 'User already exists');
      const user = await User.create({
        surName,
        firstName,
        email,
        password: hashPassword(password),
        role,
      });
      return successRes(res, 201, 'Successfully Registered a user', user);
    } catch (err) {
      return next(new ErrorResponse(res,500,`Ooops! Unable to register User :( ..... ${err.message}`));
    }
  }
  // @desc     Get current logged in user
  // @route    GET /api/auth/me
  // access    Private,

  static async logged(req, res, next) {
    try {
      const { user } = req;
      const { _id, email, firstName, surName, role } = user;
      const data = {
        _id,
        email,
        firstName,
        surName,
        role
      };
      return successRes(res, 200, 'User is logged in!', data);
    } catch (err) {
      return next(new ErrorResponse(res,400,'Error getting user! Please provide token or check the provided token!'));
    }
  }
  // @desc     User login
  // @route    GET /api/auth/login
  // access    Public,

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const foundUser = await User.findOne({ email });
      if (!foundUser) return ErrorResponse(res, 404, 'User Not found');
      const isMatch = checkPassword(password, foundUser.password);
      if (!isMatch) return ErrorResponse(res, 401, 'Invalid password');

      const token = await signToken({
        id: foundUser.id,
        email: foundUser.email,
      });
      return successRes(res, 200, 'User login successful :)', {
        token,
        foundUser,
      });
    } catch (err) {
      return next(new ErrorResponse(res,500,`Oh No! Error while logging user :( ${err.message}`));
    }
  }
}

export default Auth;
