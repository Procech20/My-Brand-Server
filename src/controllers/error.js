import ErrorResponse from '../utils/errorRes';

class NoRoute {
        static error(req, res, next) {
                return next(new ErrorResponse(res, 404, 'route not found :(  .... Please try a valid route like : /api/blogs or /api/users'));
        }
}

export default NoRoute;
