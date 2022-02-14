import Querry from '../models/querry';
import successRes from '../utils/successRes';
import ErrorResponse from '../utils/errorRes';
import querryServices from '../services/querry';

const { createQuerry, findQuerries, findQuerry, updateQuerry, deleteQuerry } =
	querryServices;

class QuerryControllers {
	// @desc  Get all Querries
	// @route GET /api/querries
	// @access Private,

	static async getQuerries(req, res) {
		const querry = await findQuerries();
		return successRes(res, 200, 'All querries retreived successfully', querry);
	}
	// @desc  Get single Querry
	// @route GET /api/querries/:id
	// @access Private,

	static async getQuerry(req, res, next) {
		try {
			const querry = await findQuerry({ id: req.params.id });
			if (!querry) {
				return next(
					new ErrorResponse(res, 404, `No querry found with such id :(`),
				);
			}

			return successRes(res, 200, 'successfully retrieved querry', querry);
		} catch (err) {
			return new ErrorResponse(
				res,
				500,
				`Unable to get querry; ${err.message}`,
			);
		}
	}

	// @desc  Create new Querry
	// @route POST /api/querries
	// @access Private,

	static async createQuerry(req, res) {
		try {
			const { project, email } = req.body;
			const existing = await Querry.findOne({ project, email });
			if (existing) return ErrorResponse(res, 400, 'Project already exists');
			const querry = await createQuerry({
				...req.body,
			});
			return successRes(res, 201, 'Successfully created querry', querry);
		} catch (err) {
			return new ErrorResponse(
				res,
				500,
				`Unable to create querry; ${err.message}`,
			);
		}
	}
	// @desc  Update Querry
	// @route PUT /api/querries/:id
	// @access Private,

	static async updateQuerry(req, res, next) {
		try {
			const foundQuerry = await findQuerry({ id: req.params.id });
			if (!foundQuerry) {
				return next(
					ErrorResponse(res, 404, `Ooops! No such Querry was found :(`),
				);
			}

			const updatedQuerry = await updateQuerry(
				{ id: req.params.id },
				{ ...req.body },
			);
			if (!updatedQuerry) {
				return next(
					ErrorResponse(res, 404, `Ooops! No such Querry was found :(`),
				);
			}
			const querry = new Querry(updatedQuerry);
			return successRes(res, 201, 'successfully updated Querry', querry);
		} catch (err) {
			return new ErrorResponse(
				res,
				500,
				`Unable to update querry; ${err.message}`,
			);
		}
	}

	// @desc  Delete Querry
	// @route DELETE /api/querries/:id
	// @access Private,

	static async deleteQuerry(req, res, next) {
		try {
			const foundQuerry = await findQuerry({ id: req.params.id });
			if (!foundQuerry) {
				return next(
					new ErrorResponse(
						res,
						404,
						`Ooops! No querry was found with the provided id!`,
					),
				);
			}

			const querry = await deleteQuerry({ id: req.params.id });
			if (!querry) {
				return next(
					new ErrorResponse(res, 404, `No querry was found with such id :(`),
				);
			}
			return successRes(res, 204, 'Deleted successfully a querry');
		} catch (err) {
			return new ErrorResponse(
				res,
				500,
				`Unable to delete querry; ${err.message}`,
			);
		}
	}
}

export default QuerryControllers;
