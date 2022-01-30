// import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';



class Protection {
        static async signToken(data) {
                const token = sign(data, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
                return token;
        }

        static async verifyToken(token) {
                const data = verify(token, process.env.JWT_SECRET);
                return data;
        }

        static hashPassword(password) { return bcrypt.hashSync(password, bcrypt.genSaltSync(10)); }

        static checkPassword(password, hashed) { return bcrypt.compareSync(password, hashed); }
}

export default Protection;
