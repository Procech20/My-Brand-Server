import ErrorResponse from '../utils/errorRes';
import userServices from '../services/user';
import encryption from '../helpers/encryption';

const { verifyToken } = encryption;

const { findUser } = userServices;

class RouteProtection {
	static async protect(req, res, next) {
		try {
			const token = req.headers.auth.split(' ')[1];
			if (!token) {
				return ErrorResponse(res, 400, 'Please log in to access the page.');
			}
			const info = await verifyToken(token);
			if (!info) {
				return ErrorResponse(res, 401, 'Invalid or expired token');
			}
			const { id } = info;
			const user = await findUser({ id });

			if (!user) {
				return ErrorResponse(res, 404, 'User not found ');
			}
			req.user = user;

			return next();
		} catch (err) {
			return ErrorResponse(
				res,
				500,
				`Error while checking token! ${err.message}`,
			);
		}
	}

	static async isAdmin(req, res, next) {
		try {
			const signedInUser = req.user;
			const user = await findUser({ id: signedInUser.id });
			if (user.role !== 'Admin') {
				return ErrorResponse(
					res,
					403,
					"Ooops! You're not allowed to access this page.",
				);
			}
			return next();
		} catch (err) {
			return ErrorResponse(
				res,
				500,
				`Error while verifying user! ${err.message}`,
			);
		}
	}
}

export default RouteProtection;
