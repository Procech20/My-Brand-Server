import schema from '../helpers/validator';
import ErrorResponse from '../utils/errorRes';

const {
        blogCreate, blogUpdate, signup, login,
} = schema;

class RouteValidators {
        static blogValidate(req, res, next) {
                const { error } = blogCreate.validate(req.body);

                if (error) { return ErrorResponse(res, 400, `Validation error: ${error.message}`); }

                return next();
        }

        static updateValidate(req, res, next) {
                const { error } = blogUpdate.validate(req.body);

                if (error) { return ErrorResponse(res, 400, `Validation error: ${error.message}`); }

                return next();
        }

        static loginValidate(req, res, next) {
                const { error } = login.validate(req.body);

                if (error) { return ErrorResponse(res, 400, `Validation error: ${error.message}`); }

                return next();
        }

        static signupValidate(req, res, next) {
                const { error } = signup.validate(req.body);

                if (error) { return ErrorResponse(res, 400, `Validation error: ${error.message}`); }

                return next();
        }
}

export default RouteValidators;
