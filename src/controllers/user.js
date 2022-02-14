import User from '../models/user';
import successRes from '../utils/successRes';
import ErrorResponse from '../utils/errorRes';
import encryption from '../helpers/encryption';
import userServices from '../services/user';
const { hashPassword } = encryption;

const { createUser, deleteOne, findUser, findUsers, updateUser } = userServices;

class UserControllers {
	// @desc  Get all Users
	// @route GET /api/users
	// @access Private,

	static async getUsers(req, res) {
		const user = await findUsers();
		return successRes(res, 200, 'All users retreived successfully', user);
	}
	// @desc  Get single User post
	// @route GET /api/users/:id
	// @access Private,

	static async getUser(req, res, next) {
		const user = await findUser({ id: req.params.id });
		if (!user) {
			return next(new ErrorResponse(res, 404, `No user found with such id :(`));
		}
		const { email, firstName, surName } = user;
		return successRes(res, 200, 'successfully retrieved user', {
			email,
			firstName,
			surName,
		});
	}
	// @desc  Create new User
	// @route POST /api/users
	// @access Private,

	static async createUser(req, res) {
		try {
			const { email, password, firstName, surName, role } = req.body;
			const existing = await User.findOne({ email });
			if (existing) return ErrorResponse(res, 400, 'User already exists');
			const hash = hashPassword(password);
			const user = await createUser({
				email,
				firstName,
				surName,
				password,
				role,
			});
			return successRes(res, 201, 'Successfully created user', {
				email,
				firstName,
				surName,
				role,
			});
		} catch (err) {
			return new ErrorResponse(
				res,
				500,
				`Unable to create user; ${err.message}`,
			);
		}
	}
	// @desc  Update User
	// @route PUT /api/users/:id
	// @access Private,

	static async updateUser(req, res, next) {
		try {
			const foundUser = await findUser({ id: req.params.id });
			if (!foundUser) {
				return next(
					ErrorResponse(res, 404, `Ooops! No such User was found :(`),
				);
			}

			const updatedUser = await updateUser(
				{ id: req.params.id },
				{ ...req.body },
			);
			if (!updatedUser) {
				return next(
					ErrorResponse(res, 404, `Ooops! No such User was found :(`),
				);
			}
			const { email, firstName, surName, role } = updatedUser;
			return successRes(res, 201, 'successfully updated user', {
				email,
				firstName,
				surName,
				role,
			});
		} catch (err) {
			return new ErrorResponse(
				res,
				500,
				`Unable to update user; ${err.message}`,
			);
		}
	}

	// @desc  Delete User
	// @route DELETE /api/users/:id
	// @access Private,

	static async deleteUser(req, res, next) {
		try {
			const foundUser = await findUser({ id: req.params.id });
			if (!foundUser) {
				return next(
					new ErrorResponse(
						res,
						404,
						`Ooops! No user was found with the provided id!`,
					),
				);
			}

			const user = await deleteOne({ id: req.params.id });
			if (!user) {
				return next(
					new ErrorResponse(res, 404, `No user was found with such id :(`),
				);
			}
			return successRes(res, 204, 'Deleted successfully a user');
		} catch (err) {
			return new ErrorResponse(
				res,
				500,
				`Unable to delete user; ${err.message}`,
			);
		}
	}
}

export default UserControllers;
