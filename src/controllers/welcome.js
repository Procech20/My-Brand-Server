import successRes from '../utils/successRes';

class Welcome {
        static greeting(req, res) {
                return successRes(res, 200, 'Hello! Welcome to My blog :)');
        }
}

export default Welcome;
